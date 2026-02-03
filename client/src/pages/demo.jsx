// client/src/pages/Register.jsx
// 👉 This file defines the Register page of the app
// 👉 It shows a signup form and handles user registration logic

// ================= IMPORTS =================

// useState → to manage form data and loading state
import { useState } from 'react';

// Link → for navigation without page reload
// useNavigate → to redirect user after successful registration
import { Link, useNavigate } from 'react-router-dom';

// useAuth → custom hook to access authentication logic (register function)
import { useAuth } from '../context/AuthContext';

// toast → to show success/error popup messages
import { toast } from 'react-toastify';

// ================= COMPONENT =================

// Register component (this is a React functional component)
const Register = () => {

  // useNavigate hook to programmatically navigate to another page
  const navigate = useNavigate();

  // Extract register function from AuthContext
  // This function talks to backend and creates a new user
  const { register } = useAuth();
  
  // ================= STATE =================

  // formData → stores all input values of the form
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  // loading → used to disable button and show loading text
  const [loading, setLoading] = useState(false);

  // Destructure values from formData for easy use
  const { name, email, password, confirmPassword } = formData;

  // ================= HANDLERS =================

  // handleChange → runs whenever user types in an input field
  // Updates the specific field based on input name
  const handleChange = (e) => {
    setFormData({
      ...formData,                 // keep previous values
      [e.target.name]: e.target.value, // update only the changed field
    });
  };

  // handleSubmit → runs when form is submitted
  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent page reload

    // ================= VALIDATION =================

    // Check if any field is empty
    if (!name || !email || !password || !confirmPassword) {
      toast.error('Please fill all fields');
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    // Check minimum password length
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    // ================= API CALL =================

    // Start loading
    setLoading(true);

    // Call register function from AuthContext
    // Sends name, email, password to backend
    const result = await register({ name, email, password });

    // Stop loading
    setLoading(false);

    // ================= RESPONSE HANDLING =================

    if (result.success) {
      // Show success message
      toast.success('Registration successful!');

      // Redirect user to dashboard
      navigate('/dashboard');
    } else {
      // Show error message from backend
      toast.error(result.message);
    }
  };

  // ================= UI (JSX) =================

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">

        {/* Page Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
          <p className="text-gray-600 mt-2">Sign up to get started</p>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Name Input */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
            />
          </div>

          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handleChange}
              placeholder="Create a password"
              required
            />
          </div>

          {/* Confirm Password Input */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        {/* Login Page Link */}
        <p className="text-center text-gray-600 mt-6">
          Already have an account?{' '}
          <Link to="/login">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

// Export Register component so it can be used in routes
export default Register;
