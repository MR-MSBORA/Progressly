// Import mongoose for MongoDB schema and bcrypt for password hashing
import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";

// ======================= USER SCHEMA =======================
// Define the structure of the User document in MongoDB
const UserSchema = new Schema(
  {
    // ---------------- USERNAME ----------------
    username: {
      type: String,                  // Must be a string
      required: [true, "PLEASE ENTER NAME"], // Field is required with error message
      trim: true,                    // Remove spaces at start/end
      maxlength: [50, "NAME CANNOT BE MORE THAN 50 WORDS"] // Max 50 chars
    },

    // ---------------- EMAIL ----------------
    email: {
      type: String,                  // Must be a string
      required: [true, "EMAIL IS REQUIRED"], // Field is required
      unique: true,                  // Email must be unique in DB
      lowercase: true,               // Always store email in lowercase
      trim: true,                     // Remove extra spaces
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email'   // Regex pattern to validate email
      ]
    },

    // ---------------- PASSWORD ----------------
    password: {
      type: String,                  // Must be a string
      required: [true, "PASSWORD IS REQUIRED"], // Field is required
      minlength: [6, "Password must be at least 6 characters"], // Min length
      select: false                  // By default, do not return password in queries
    },

    // ---------------- CREATED AT ----------------
    createdAt: {
      type: Date,                    // Date type
      default: Date.now              // Defaults to current timestamp
    }
  },
  {
    timestamps: true                 // Adds createdAt and updatedAt automatically
  }
);

// ======================= PASSWORD HASHING =======================
// Pre-save middleware: runs before saving a user document
UserSchema.pre('save', async function () {
  // If password is not modified, do nothing (important for update operations)
  if (!this.isModified("password")) return;

  // Hash the password using bcrypt with 10 salt rounds
  this.password = await bcrypt.hash(this.password, 10);
});

// ======================= PASSWORD COMPARISON METHOD =======================
// This method allows us to compare entered password with hashed password
UserSchema.methods.matchPassword = async function (enterPassword) {
  // bcrypt.compare returns true if passwords match
  return await bcrypt.compare(enterPassword, this.password);
};

// ======================= EXPORT USER MODEL =======================
// Create User model from schema
const User = mongoose.model('User', UserSchema);
export default User;
