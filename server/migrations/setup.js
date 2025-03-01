const mongoose = require("mongoose");

const migrationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  appliedAt: {
    type: Date,
    default: Date.now,
  },
});

const Migration = mongoose.model("Migration", migrationSchema);

module.exports = Migration;
