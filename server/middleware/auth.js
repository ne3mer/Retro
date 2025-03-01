const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  try {
    // Log headers for debugging
    console.log("[Auth] Headers:", {
      origin: req.headers.origin,
      cookie: req.headers.cookie,
      authorization: req.headers.authorization,
    });

    // Get token from cookie or Authorization header
    let token = req.cookies.token;

    if (!token && req.headers.authorization) {
      token = req.headers.authorization.replace("Bearer ", "");
    }

    if (!token) {
      console.error("[Auth] No token found");
      return res.status(401).json({ message: "No authentication token found" });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (!decoded || !decoded.userId) {
        console.error("[Auth] Invalid token payload:", decoded);
        res.clearCookie("token", {
          httpOnly: true,
          secure: true,
          sameSite: "none",
        });
        return res.status(401).json({ message: "Invalid token" });
      }

      // Check token expiration
      const now = Math.floor(Date.now() / 1000);
      if (decoded.exp && decoded.exp < now) {
        console.error("[Auth] Token expired");
        res.clearCookie("token", {
          httpOnly: true,
          secure: true,
          sameSite: "none",
        });
        return res.status(401).json({ message: "Token expired" });
      }

      // Add user info to request
      req.user = {
        userId: decoded.userId,
        username: decoded.username,
      };

      next();
    } catch (error) {
      console.error("[Auth] Token verification failed:", error);

      // Clear invalid token
      res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });

      // Handle specific JWT errors
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token expired" });
      } else if (error.name === "JsonWebTokenError") {
        return res.status(401).json({ message: "Invalid token" });
      }

      return res.status(401).json({ message: "Authentication failed" });
    }
  } catch (error) {
    console.error("[Auth] Unexpected error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = auth;
