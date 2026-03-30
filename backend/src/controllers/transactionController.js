const { nanoid } = require("nanoid");

const Transaction = require("../models/Transaction");
const Wallet = require("../models/Wallet");

async function listTransactions(req, res, next) {
  try {
    const transactions = await Transaction.find({ userId: req.userId })
      .sort({ date: -1, createdAt: -1 })
      .lean();

    res.json(transactions);
  } catch (error) {
    next(error);
  }
}

async function createTransaction(req, res, next) {
  const {
    title,
    amount,
    type = "expense",
    category = "General",
    walletId,
  } = req.body;

  if (!title || !amount || !walletId) {
    return res.status(400).json({
      message: "title, amount and walletId are required",
    });
  }

  try {
    const wallet = await Wallet.findOne({ userId: req.userId, id: walletId });

    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    const numericAmount = Number(amount);

    if (Number.isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({ message: "Amount must be a positive number" });
    }

    if (type === "expense" && wallet.balance < numericAmount) {
      return res.status(400).json({ message: "Insufficient wallet balance" });
    }

    wallet.balance =
      type === "income" ? wallet.balance + numericAmount : wallet.balance - numericAmount;
    await wallet.save();

    const transaction = await Transaction.create({
      id: nanoid(10),
      userId: req.userId,
      title,
      amount: numericAmount,
      type,
      category,
      walletId,
      date: new Date(),
    });

    res.status(201).json(transaction);
  } catch (error) {
    next(error);
  }
}

async function transferFunds(req, res, next) {
  const { sourceWalletId, targetWalletId, amount, title = "Wallet Transfer" } = req.body;

  if (!sourceWalletId || !targetWalletId || !amount) {
    return res.status(400).json({
      message: "sourceWalletId, targetWalletId and amount are required",
    });
  }

  if (sourceWalletId === targetWalletId) {
    return res.status(400).json({ message: "Source and target wallets must differ" });
  }

  const numericAmount = Number(amount);

  if (Number.isNaN(numericAmount) || numericAmount <= 0) {
    return res.status(400).json({ message: "Amount must be a positive number" });
  }

  try {
    const sourceWallet = await Wallet.findOne({ userId: req.userId, id: sourceWalletId });
    const targetWallet = await Wallet.findOne({ userId: req.userId, id: targetWalletId });

    if (!sourceWallet || !targetWallet) {
      return res.status(404).json({ message: "One or both wallets were not found" });
    }

    if (sourceWallet.balance < numericAmount) {
      return res.status(400).json({ message: "Insufficient funds in source wallet" });
    }

    sourceWallet.balance -= numericAmount;
    targetWallet.balance += numericAmount;

    await Promise.all([sourceWallet.save(), targetWallet.save()]);

    const transfer = await Transaction.create({
      id: nanoid(10),
      userId: req.userId,
      type: "transfer",
      title,
      category: "Transfer",
      amount: numericAmount,
      sourceWalletId,
      targetWalletId,
      walletId: sourceWalletId,
      date: new Date(),
    });

    res.status(201).json(transfer);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listTransactions,
  createTransaction,
  transferFunds,
};
