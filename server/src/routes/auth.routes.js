// ================= IMPORTS =================

// Express is used to create the router
import express from 'express';

// Import auth controller functions
// These handle business logic for authentication
import {
  register,
  login,
  getMe,
  updateDetails,
  updatePassword,
  forgotPassword,
  resetPassword
} from '../controllers/authController.js';

// Middleware to protect private routes (JWT verification)
import { protect } from '../middleware/auth.js';


// ================= ROUTER SETUP =================

// Create an Express router instance
const router = express.Router();


// ================= PUBLIC ROUTES =================
//
// These routes DO NOT require authentication
//

// Register a new user
router.post('/register', register);

// Login existing user
router.post('/login', login);

// Send password reset email
router.post('/forgotpassword', forgotPassword);

// Reset password using token from email
router.put('/resetpassword/:resettoken', resetPassword);


// ================= PROTECTED ROUTES =================
//
// These routes REQUIRE a valid JWT token
// `protect` middleware runs before controller
//

// Get currently logged-in user details
router.get('/me', protect, getMe);

// Update user profile details (name, email, etc.)
router.put('/updatedetails', protect, updateDetails);

// Update user password (requires old password check)
router.put('/updatepassword', protect, updatePassword);


// ================= EXPORT ROUTER =================
//
// Makes routes available to main app
//
export default router;
