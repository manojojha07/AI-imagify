import jwt from "jsonwebtoken";

const authProtect = (req, res, next) => {
  try {
    // Header se token lo
    const token = req.headers.token;

    if (!token) {
      return res.status(401).json({ success: false, message: "User not authorized" });
    }

    // Token verify karo
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.id) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    // User ID middleware me set karo
    req.userId = decoded.id;

    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Token verification failed", error: error.message });
  }
};

export default authProtect;
