// ======================= IMPORTS =======================
// React hooks needed for context and state management
import React, {
  useContext,     // used to consume context
  createContext,  // used to create context
  useState,       // used to store user, token, loading
  useEffect       // used to run code when component loads
} from 'react'

// Axios is used to communicate with backend APIs
import axios from "axios"


// ======================= CREATE CONTEXT =======================
// AuthContext will store auth-related data (user, token, functions)
// This avoids prop-drilling (passing props again and again)
const AuthContext = createContext();


// ======================= CUSTOM HOOK =======================
// This hook allows us to access AuthContext easily in any component
// Example usage: const { user, login, logout } = useAuth();
export const useAuth = () => {
    const context = useContext(AuthContext)

    // Safety check: ensures hook is used inside AuthProvider
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }

    return context;
}


// ======================= AUTH PROVIDER =======================
// This component wraps the app and provides auth data to all children
export const AuthProvider = ({ children }) => {

    // Stores logged-in user details
    const [user, setUser] = useState(null);

    // Used to show loading spinner while checking auth
    const [loading, setLoading] = useState(true);

    // Stores JWT token (initially fetched from localStorage)
    const [token, setToken] = useState(localStorage.getItem('token'));


    // ======================= LOAD USER ON PAGE REFRESH =======================
    // This runs ONCE when app loads
    // Purpose: keep user logged in even after refresh
    useEffect(() => {

        const loadUser = async () => {
            // Get token from browser storage
            const storedToken = localStorage.getItem('token');

            // If token exists, verify it with backend
            if (storedToken) {
                try {
                    // Send token to backend to get user details
                    const response = await axios.get('/auth/me', {
                        headers: {
                            Authorization: `Bearer ${storedToken}` // JWT token
                        }
                    });

                    // If token is valid, update state
                    if (response.data.success) {
                        setUser(response.data.user); // store user info
                        setToken(storedToken);       // store token in state
                    }

                } catch (error) {
                    // Token is invalid or expired
                    console.error('Failed to load user:', error);

                    // Clear invalid token
                    localStorage.removeItem('token');
                    setToken(null);
                }
            }

            // Auth check completed
            setLoading(false);
        }

        loadUser();
    }, []); // Empty dependency array → runs only once


    // ======================= REGISTER FUNCTION =======================
    // Sends new user data to backend
    const register = async (username, email, password) => {
        try {
            const response = await axios.post('/auth/register', {
                username,
                email,
                password
            });

            // If registration successful
            if (response.data.success) {
                const { token, user } = response.data;

                // Save token in localStorage (persistent login)
                localStorage.setItem('token', token);

                // Update state
                setToken(token);
                setUser(user);
            }
        } catch (error) {
            // Pass backend error message to UI
            throw new Error(
              error.response?.data?.message || 'Registration failed'
            );
        }
    };


    // ======================= LOGIN FUNCTION =======================
    // Authenticates user and stores token
    const login = async (email, password) => {
        try {
            const response = await axios.post('/auth/login', {
                email,
                password
            });

            if (response.data.success) {
                const { token, user } = response.data;

                // Store token for future requests
                localStorage.setItem('token', token);

                // Update auth state
                setToken(token);
                setUser(user);
            }
        } catch (error) {
            throw new Error(
              error.response?.data?.message || 'Login failed'
            );
        }
    };


    // ======================= LOGOUT FUNCTION =======================
    // Clears auth data and logs user out
    const logout = () => {
        localStorage.removeItem('token'); // remove stored token
        setToken(null);                   // clear token state
        setUser(null);                    // clear user state
    };


    // ======================= CONTEXT VALUE =======================
    // All data & functions that will be accessible globally
    const value = {
        user,                // logged-in user info
        token,               // JWT token
        loading,             // loading status
        login,               // login function
        register,            // register function
        logout,              // logout function
        isAuthenticated: !!user && !!token // boolean auth check
    };


    // ======================= PROVIDE CONTEXT =======================
    // Makes auth data available to all child components
    return (
      <AuthContext.Provider value={value}>
        {children}
      </AuthContext.Provider>
    );
}

export default AuthContext;
