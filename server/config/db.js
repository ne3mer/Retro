const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("Attempting to connect to MongoDB...");
    console.log(
      "MongoDB URI:",
      process.env.MONGODB_URI || "mongodb://localhost:27017/retroterminal"
    );

    const conn = await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/retroterminal"
    );

    console.log(`[DATABASE] MongoDB Connected: ${conn.connection.host}`);
    console.log(`[DATABASE] Database Name: ${conn.connection.name}`);
    console.log("[DATABASE] Connection State:", mongoose.connection.readyState);

    // Test the connection by trying to get the list of collections
    const collections = await conn.connection.db.listCollections().toArray();
    console.log(
      "[DATABASE] Available collections:",
      collections.map((col) => col.name)
    );

    return conn;
  } catch (error) {
    console.error("[DATABASE ERROR] Connection error details:");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Full error:", error);
    process.exit(1);
  }
};

// Export both the connection function and the mongoose instance
module.exports = connectDB;
