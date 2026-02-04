// ================= IMPORTS =================

// Email utility for sending emails
import sendEmail from '../utils/sendEmail.js';

// Node core modules
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// User model
import User from '../models/User.js';

// JWT token generator (assumed to exist)
import generateToken from '../utils/generateToken.js';

// Resolve __dirname equivalent in ES modules
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// ================= HELPER: LOAD EMAIL TEMPLATE =================
//
// Reads an HTML email template from /templates
// Replaces {{variables}} with real values
//
const loadTemplate = (templateName, variables) => {
  const templatePath = path.join(
    __dirname,
    '../templates',
    `${templateName}.html`
  );

  // Read HTML file as string
  let template = fs.readFileSync(templatePath, 'utf-8');

  // Replace placeholders like {{name}}, {{resetUrl}}, etc.
  Object.keys(variables).forEach(key => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    template = template.replace(regex, variables[key]);
  });

  return template;
};


// ================= REGISTER USER =================
//
// Creates new user
// Sends welcome email
// Sends alert if email already exists
//
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email and password'
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {

      // Notify user about failed registration attempt
      if (userExists.emailNotifications) {
        const html = loadTemplate('loginAlert', {
          name: userExists.name,
          status: 'Failed',
          success: false,
          time: new Date().toLocaleString(),
          location: 'Unknown',
          ip: req.ip || 'Unknown',
          resetUrl: `${process.env.CLIENT_URL}/forgot-password`
        });

        await sendEmail({
          email: userExists.email,
          subject: '⚠️ Failed Registration Attempt',
          html
        });
      }

      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Create new user
    const user = await User.create({ name, email, password });

    // Generate JWT
    const token = generateToken(user._id);

    // Send welcome email
    const html = loadTemplate('welcome', {
      name: user.name,
      dashboardUrl: `${process.env.CLIENT_URL}/dashboard`
    });

    await sendEmail({
      email: user.email,
      subject: '🎉 Welcome to ProgressTrack!',
      html
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
};


// ================= LOGIN USER =================
//
// Authenticates user
// Sends login success/failure alerts
//
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Fetch user including password
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Compare passwords
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {

      // Failed login alert
      if (user.loginAlerts) {
        const html = loadTemplate('loginAlert', {
          name: user.name,
          status: 'Failed',
          success: false,
          time: new Date().toLocaleString(),
          location: 'Unknown',
          ip: req.ip || 'Unknown',
          resetUrl: `${process.env.CLIENT_URL}/forgot-password`
        });

        await sendEmail({
          email: user.email,
          subject: '⚠️ Failed Login Attempt',
          html
        });
      }

      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const token = generateToken(user._id);

    // Successful login alert
    if (user.loginAlerts) {
      const html = loadTemplate('loginAlert', {
        name: user.name,
        status: 'Successful',
        success: true,
        time: new Date().toLocaleString(),
        location: 'Unknown',
        ip: req.ip || 'Unknown'
      });

      await sendEmail({
        email: user.email,
        subject: '✅ Successful Login',
        html
      });
    }

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};


// ================= FORGOT PASSWORD =================
//
// Generates reset token
// Emails reset link
//
export const forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No user found with that email'
      });
    }

    // Generate reset token
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    const html = loadTemplate('resetPassword', {
      name: user.name,
      resetUrl
    });

    await sendEmail({
      email: user.email,
      subject: '🔑 Password Reset Request',
      html
    });

    res.status(200).json({
      success: true,
      message: 'Password reset email sent'
    });

  } catch (error) {
    console.error('Forgot Password Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};


// ================= RESET PASSWORD =================
//
// Verifies token
// Updates password
//
export const resetPassword = async (req, res) => {
  try {
    // Hash token from URL
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resettoken)
      .digest('hex');

    // Find valid token
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    // Confirmation email
    const html = `
      <h2>Password Reset Successful</h2>
      <p>Hi ${user.name},</p>
      <p>Your password has been successfully reset.</p>
    `;

    await sendEmail({
      email: user.email,
      subject: '✅ Password Reset Successful',
      html
    });

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Password reset successful',
      token
    });

  } catch (error) {
    console.error('Reset Password Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
