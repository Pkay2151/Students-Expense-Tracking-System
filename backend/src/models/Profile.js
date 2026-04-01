const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    userId: { type: String, required: true, unique: true, index: true },
    fullName: { type: String, trim: true, default: "" },
    email: { type: String, trim: true, lowercase: true, default: "" },
    avatarUrl: { type: String, trim: true, default: "" },
    currency: {
      type: String,
      enum: ["USD", "GHS", "EUR", "NGN", "KES", "GBP"],
      default: "GHS",
    },
    preferences: {
      receiveBudgetAlerts: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Profile", profileSchema);
