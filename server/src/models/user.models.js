// ================= IMPORTS =================

// Mongoose is used to define schemas and interact with MongoDB
import mongoose from 'mongoose';

// bcrypt is used for hashing passwords and comparing them securely
import bcrypt from 'bcryptjs';

// crypto is a Node.js core module used for generating secure random tokens
// Here it is used for password reset functionality
import crypto from 'crypto';


// ================= USER SCHEMA =================
//
// This schema defines the structure of a User document in MongoDB.
// Each field describes what data is stored and how it should behave.
//
const UserSchema = new mongoose.Schema({

  // ---------------- NAME ----------------
  // Stores the user's full name
  name: {
    type: String,                             // Data type
    required: [true, 'Please add a name'],    // Mandatory field with custom error
    trim: true,                               // Removes extra spaces
    maxlength: [50, 'Name cannot be more than 50 characters']
  },

  // ---------------- EMAIL ----------------
  // Used as a unique identifier for login
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,                             // Ensures no duplicate emails
    lowercase: true,                          // Converts email to lowercase
    trim: true,
    match: [
      // Regular expression to validate email format
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },

  // ---------------- PASSWORD ----------------
  // Stores the hashed password (never plain text)
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: [6, 'Password must be at least 6 characters'],

    // select: false means:
    // 👉 This field will NOT be returned in queries by default
    // 👉 Helps prevent accidental password exposure
    select: false
  },

  // ================= PASSWORD RESET =================

  // Stores the hashed version of the password reset token
  // (The plain token is sent to the user's email)
  resetPasswordToken: String,

  // Stores the expiration time of the reset token
  resetPasswordExpire: Date,

  // ================= USER SETTINGS =================

  // Controls whether the user receives general email notifications
  emailNotifications: {
    type: Boolean,
    default: true
  },

  // Controls whether the user receives alerts on login
  loginAlerts: {
    type: Boolean,
    default: true
  },

  // Stores the date when the account was created
  createdAt: {
    type: Date,
    default: Date.now
  }
});


// ================= MONGOOSE MIDDLEWARE =================
//
// This middleware runs automatically BEFORE saving a user document.
// Its job is to hash the password securely.
//
UserSchema.pre('save', async function (next) {

  // If the password field was NOT modified
  // (e.g., updating name or email),
  // then skip hashing to avoid double-hashing
  if (!this.isModified('password')) {
    return next();
  }

  // Generate a salt (random data used to strengthen hashing)
  const salt = await bcrypt.genSalt(10);

  // Hash the password using the generated salt
  this.password = await bcrypt.hash(this.password, salt);

  // Continue saving the document
  next();
});


// ================= INSTANCE METHODS =================
//
// These methods are available on individual user documents
// Example: user.matchPassword('123456')


// -------- PASSWORD COMPARISON --------
//
// Used during login to compare entered password
// with the hashed password stored in the database
//
UserSchema.methods.matchPassword = async function (enteredPassword) {

  // bcrypt.compare:
  // 👉 hashes the entered password
  // 👉 compares it with the stored hash
  // 👉 returns true or false
  return await bcrypt.compare(enteredPassword, this.password);
};


// -------- PASSWORD RESET TOKEN GENERATION --------
//
// Used when a user clicks "Forgot Password"
//
UserSchema.methods.getResetPasswordToken = function () {

  // Step 1: Generate a random token (plain text)
  const resetToken = crypto
    .randomBytes(20)          // Creates random bytes
    .toString('hex');         // Converts to readable string

  // Step 2: Hash the token before saving to database
  // (For security reasons, just like passwords)
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Step 3: Set token expiration time (10 minutes from now)
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  // Step 4: Return the plain token
  // This token is sent to the user's email
  return resetToken;
};


// ================= EXPORT MODEL =================
//
// Creates and exports the User model
// This allows us to use User.find(), User.create(), etc.
//
export default mongoose.model('User', UserSchema);
