// Create a .env file in the server directory
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

// Generate a random JWT secret key
const jwtSecret = crypto.randomBytes(64).toString("hex");

const envContent = `
# Server Environment Variables
PORT=5001
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/retroterminal

# JWT Secret for Authentication
JWT_SECRET=${jwtSecret}

# TMDB API Key (if you have one)
TMDB_API_KEY=a48263c4c028a8de6a15f323f065057a

# Admin Password
ADMIN_PASSWORD=912A3060859n
`;

// Path to server's .env file
const envPath = path.join(__dirname, "server", ".env");

// Write the .env file
fs.writeFileSync(envPath, envContent);
console.log(`Server .env file created at ${envPath}`);
console.log("JWT_SECRET has been generated and added to your .env file");
console.log(
  "You can now start the server with the required environment variables"
);

// Instructions for the user
console.log("\n=== INSTRUCTIONS ===");
console.log("1. Make sure MongoDB is running locally (or update MONGODB_URI)");
console.log("2. Navigate to the server directory and start the server:");
console.log("   cd server && npm run dev");
console.log("3. In a separate terminal, start the client:");
console.log("   cd client && npm start");
console.log("4. Your app should now be running at http://localhost:3000");
