import User from "../models/user.models"
import jwt from "jsonwebtoken"

// ****GENERATE_TOKEN FUNCTION
// Creates a signed JWT token containing the user's ID.
//It creates an ID card that is valid for the next 7 days whenever a user logs in or signs up.
//This new ID card (token) helps the server recognize the user and allow access to their data whenever they use the web app.
//The server identifies the user in the database using the unique ID stored in the token.

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET), {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  }
};

// *****REGISTER FUNCTION
//Frontend sends data → name, email, password via req.body.
//Server checks for missing fields → prevents incomplete data from being saved.
//Email uniqueness check → stops registration if email already exists → avoids duplicates.
//Create new user → saves user in database if all checks pass.
//Password hashing → password is encrypted automatically before saving → real password never stored.
//Generate JWT token → generateToken(user._id) creates a secure token for the user.
//Send response to frontend → returns token + basic user info.
//Immediate login → user is logged in right after registration without needing separate login.

export const register = async (req, res, nect) => {
  try {
    const { username, email, password } = req.body();

    if (!username) {
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

    const user = await User.create({ username, email, password });

    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: { id: user._id, name: user.username, email: user.email }
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

// ******LOGIN FUNCTION AUTHENTICATION

export const login = async (req, res) => {

  try {

    const { email, password } = res.body();
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

    const user = User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await User.matchPasssword(password);

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