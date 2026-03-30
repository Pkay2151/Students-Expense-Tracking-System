const express = require("express");
const { nanoid } = require("nanoid");

const Wallet = require("../models/Wallet");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const wallets = await Wallet.find({ userId: req.userId }).sort({ createdAt: 1 }).lean();
    res.json(wallets);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  const { name, type = "bank", balance = 0 } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Wallet name is required" });
  }

  try {
    const wallet = await Wallet.create({
      id: nanoid(10),
      userId: req.userId,
      name,
      type,
      balance: Number(balance) || 0,
    });

    res.status(201).json(wallet);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
