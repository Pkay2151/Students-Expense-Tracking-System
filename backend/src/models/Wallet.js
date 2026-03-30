const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    userId: { type: String, required: true, index: true },
    name: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ["bank", "mobile", "cash"],
      default: "bank",
    },
    balance: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Wallet", walletSchema);
