const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  try {
    console.log(
      `[Auth] Checking authentication for ${req.method} ${req.originalUrl}`
    );
    console.log("[Auth] Headers:", req.headers);
    console.log("[Auth] Cookies:", req.cookies);

    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      console.log("[Auth] No token found in cookies or headers");
      return res.status(401).json({ message: "Authentication required" });
    }

    console.log("[Auth] Token found, verifying...");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded || !decoded.userId) {
      console.log("[Auth] Invalid token payload:", decoded);
      return res.status(401).json({ message: "Invalid token payload" });
    }

    req.user = decoded;
    console.log(`[Auth] Token valid for user: ${decoded.userId}`);

    next();
  } catch (error) {
    console.error("[Auth] Token verification failed:", error);
    console.error("[Auth] Error details:", {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });

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
