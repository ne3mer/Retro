const mongoose = require("mongoose");

const categories = [
  "TECHNOLOGY",
  "PROGRAMMING",
  "AI",
  "RETRO",
  "GAMING",
  "OTHER",
];

module.exports = {
  async up() {
    // Get the existing categories collection or create it
    const Category = mongoose.model(
      "Category",
      new mongoose.Schema({
        name: {
          type: String,
          required: true,
          unique: true,
          uppercase: true,
          trim: true,
        },
      })
    );

    // Insert categories
    for (const category of categories) {
      await Category.findOneAndUpdate(
        { name: category },
        { name: category },
        { upsert: true, new: true }
      );
    }

    console.log("Categories migration completed");
  },

  async down() {
    const Category = mongoose.model("Category");
    await Category.deleteMany({ name: { $in: categories } });
    console.log("Categories migration reverted");
  },
};
