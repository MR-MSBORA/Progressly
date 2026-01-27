import jwt from "jsonwebtoken";
import User from "../../src/models/user.models.js";

const protect = async (req, res, next) => {
  let token;

  // 1️⃣ Check Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    // 2️⃣ Extract token
    token = req.headers.authorization.split(" ")[1];
  }

  // 3️⃣ No token
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized. Please login.",
    });
  }

  try {
    // 4️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 5️⃣ Find user
    req.user = await User.findById(decoded.userId).select("-password");

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not found. Please login again.",
      });
    }

    // 6️⃣ Continue
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Token invalid or expired.",
    });
  }
};

export default protect;
