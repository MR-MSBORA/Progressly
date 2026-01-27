// Import Express framework to create routes and APIs
import express from "express";

// bcrypt is used to hash (encrypt) passwords before saving to DB
import bcrypt from "bcryptjs";

// jsonwebtoken is used to create and verify JWT tokens
import jwt from "jsonwebtoken";

// User model to interact with users collection in MongoDB
import User from "../models/user.models.js";

// auth middleware protects private routes by verifying JWT token
import auth from "../middleware/auth.js";

// Create a router instance (modular routing)
const router = express.Router();

// ======================= REGISTER ROUTE =======================
router.post('/register', async (req, res) => {
    try {
        // ⬇️ CHANGE: name → username
        const { username, email, password } = req.body;

        // Step 1: Basic validation
        // ⬇️ CHANGE: name → username
        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields: username, email, and password'
            });
        }

        // Step 2: Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        // Step 3: Password strength check
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters long'
            });
        }

        // Step 4: Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Step 5: Create new user document
        // ⬇️ CHANGE: name → username
        const user = new User({
            username,
            email: email.toLowerCase(),
            password: hashedPassword
        });

        // Save user to database
        await user.save();

        // Step 6: Generate JWT token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE || '7d' }
        );

        // Step 7: Send success response
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            token,
            user: {
                id: user._id,
                username: user.username,  // ⬅️ CHANGE: name → username
                email: user.email,
            }
        });

    } catch (error) {
        console.log("Registration Error: ", error);
        return res.status(500).json({
            success: false,
            message: 'Server error during registration',
            error: error.message
        });
    }
});

// ======================= LOGIN ROUTE =======================
// Login response also needs updating
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email'
            });
        }

        if (!password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide password'
            });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE || '7d' }
        );

        return res.json({
            success: true,
            message: 'Login Successful',
            token,
            user: {
                id: user._id,
                username: user.username,  // ⬅️ CHANGE: name → username
                email: user.email
            }
        });

    } catch (error) {
        console.log('Login Error: ', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login',
            error: error.message
        });
    }
});

// ======================= GET CURRENT USER =======================
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User Not Found'
            });
        }

        res.json({
            success: true,
            user: {
                id: user._id,
                username: user.username,  // ⬅️ CHANGE: name → username
                email: user.email,
                createdAt: user.createdAt
            }
        });

    } catch (error) {
        console.log("Get User Error: ", error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching user data',
            error: error.message
        });
    }
});

export default router;