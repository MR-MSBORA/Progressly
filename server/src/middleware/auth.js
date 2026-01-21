import jwt from "jsonwebtoken"
import User from "../../src/models/user.models"

export const protect = async (req, res, next) => {
    let token

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer') // JWT standard format: Bearer <token>
    ) {
        token = req.headers.authorization.split[' '](1); // Extract token from "Bearer TOKEN"
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            message: " Not authorized to access this route. Please login."
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Verify token - jwt.verify() validates the JWT using the secret key and decodes the payload. If the token is invalid or expired, it throws an error.
        req.user = await User.findById(decoded.id)  // Find user by id from token payload
        // using req.user  as Attaching to req is the only way to pass info from middleware to route handlers in Express.
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'User not found. Please login again.'
            })
        }
        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized to access this route. Token invalid or expired.'
        });

    }


};