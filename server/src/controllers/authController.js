import User from "../models/user.models"
import jwt from "jsonwebtoken"

// ****GENERATE_TOKEN FUNCTION*******
// Creates a signed JWT token containing the user's ID.
//It creates an ID card that is valid for the next 7 days whenever a user logs in or signs up.
//This new ID card (token) helps the server recognize the user and allow access to their data whenever they use the web app.
//The server identifies the user in the database using the unique ID stored in the token.

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  )
};

// *******REGISTER FUNCTION************
//Frontend sends data → name, email, password via req.body.
//Server checks for missing fields → prevents incomplete data from being saved.
//Email uniqueness check → stops registration if email already exists → avoids duplicates.
//Create new user → saves user in database if all checks pass.
//Password hashing → password is encrypted automatically before saving → real password never stored.
//Generate JWT token → generateToken(user._id) creates a secure token for the user.
//Send response to frontend → returns token + basic user info.
//Immediate login → user is logged in right after registration without needing separate login.

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Please provide NAME'
      })
    }
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide EMAIL'
      })
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide PASSWORD'
      })
    }


    const userExist = await User.findOne({ email });

    if (userExist) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      })
    }

    const user = await User.create({ name, email, password });

    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: error.message
    });

  }

}

// ******LOGIN FUNCTION AUTHENTICATION***********
// Read email & password from request
//Find user by email
//Compare entered password with hashed password
//If invalid → return “Invalid credentials”
//If valid → generate JWT token
//Send token to frontend for future requests

export const login = async (req, res) => {

  try {

    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide EMAIL'
      })
    }
    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide PASSWORD'
      })
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    res.status(200).json
      ({
        success: true,
        message: 'Login successful',
        token,
        user: { id: user._id, email: user.email }
      })


  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message
    });
  }
}

//******* GETME***********
//Middleware identifies the user once and attaches them to req.user,
//  so all protected routes know who is logged in without repeating token checks.

//Token → ID card
//Middleware → Security guard
//req.user → Name written on visitor badge
//getMe → Receptionist checking the badge

export const getMe = async (req, res) => {

  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('GetMe Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });

  }
}


// ***** UPDATE_DETAILS*******
//Used by a logged-in user to update name or email
//Route is protected (token required)
//Only fields provided by user are updated
//Prevents overwriting existing data with empty values
//Uses user ID from req.user
//Ensures users can update only their own data
//Protects against changing another user’s information

export const updateDetails = async (req, res) => {
  try {

    const { name, email } = req.body;
    const fieldsToUpdate = {};
    if (name) fieldsToUpdate.name = name;
    if (email) fieldsToUpdate.email = email;
    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true
    })

    res.status(200).json({
      success: true,
      message: 'User details updated successfully',
      user: { id: user._id, name: user.name, email: user.email }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Server error'
    })
  }
}


// ******* UPDATE_PASSWORD *******
//Password update requires current password, verifies it, saves new password securely, and issues a new token for security.

//Route is protected (user must be logged in)
//User must provide current password
//Prevents unauthorized password changes
//Server compares current password with hashed password in DB
//Password change allowed only if passwords match
//New password is hashed and saved
//A new JWT token is generated
//Old tokens become unsafe → fresh secure access


export const updatePassword = async (req, res) => {
  try {

    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current and new password'
      })
    }

    const user = await User.findById(req.user.id).select('+password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }


    const isMatch = await user.matchPassword(currentPassword);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }
    user.password = newPassword;
    await user.save();

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Password updated successfully',
      token
    })

  } catch (error) {
    console.log(error)
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    })

  }
}
