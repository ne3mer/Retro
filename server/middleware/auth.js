const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  try {
    console.log(
      `[Auth] Checking authentication for ${req.method} ${req.originalUrl}`
    );
    console.log("[Auth] Cookies:", req.cookies);

    const token = req.cookies.token;

    if (!token) {
      console.log("[Auth] No token found in cookies");
      return res.status(401).json({ message: "Authentication required" });
    }

    console.log("[Auth] Token found, verifying...");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log(`[Auth] Token valid for user: ${decoded.userId}`);

    next();
  } catch (error) {
    console.error("[Auth] Token verification failed:", error.message);

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token format" });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }

    res.status(401).json({ message: "Authentication failed" });
  }
};

module.exports = auth;
