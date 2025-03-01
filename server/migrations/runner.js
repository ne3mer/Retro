const fs = require("fs").promises;
const path = require("path");
const mongoose = require("mongoose");
const Migration = require("./setup");
require("dotenv").config();

const runMigrations = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB for migrations");

    // Get all migration files
    const migrationFiles = await fs.readdir(path.join(__dirname, "scripts"));
    const pendingMigrations = migrationFiles
      .filter((file) => file.endsWith(".js"))
      .sort(); // Ensure migrations run in order

    // Check which migrations have already been applied
    for (const file of pendingMigrations) {
      const migrationName = path.parse(file).name;
      const exists = await Migration.findOne({ name: migrationName });

      if (!exists) {
        console.log(`Running migration: ${migrationName}`);

        // Execute migration
        const migration = require(path.join(__dirname, "scripts", file));
        await migration.up();

        // Record migration
        await Migration.create({ name: migrationName });
        console.log(`Completed migration: ${migrationName}`);
      } else {
        console.log(`Skipping migration ${migrationName} (already applied)`);
      }
    }

    console.log("All migrations completed successfully");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
};

// Run migrations if this file is executed directly
if (require.main === module) {
  runMigrations();
}

module.exports = runMigrations;
