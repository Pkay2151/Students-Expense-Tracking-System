const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true, trim: true },
    amount: { type: Number, required: true },
    type: {
      type: String,
      enum: ["income", "expense", "transfer"],
      default: "expense",
    },
    category: { type: String, default: "General" },
    walletId: { type: String },
    sourceWalletId: { type: String },
    targetWalletId: { type: String },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);
