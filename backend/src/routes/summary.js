const express = require("express");

const Wallet = require("../models/Wallet");
const Transaction = require("../models/Transaction");
const Budget = require("../models/Budget");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const [wallets, transactions, budgets] = await Promise.all([
      Wallet.find({ userId: req.userId }).lean(),
      Transaction.find({ userId: req.userId }).sort({ date: -1, createdAt: -1 }).lean(),
      Budget.find({ userId: req.userId }).lean(),
    ]);

    const totalBalance = wallets.reduce((sum, wallet) => sum + wallet.balance, 0);

    const totalIncome = transactions
      .filter((transaction) => transaction.type === "income")
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    const totalExpenses = transactions
      .filter((transaction) => transaction.type === "expense")
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    const budgetByCategory = budgets.map((budget) => {
      const spent = transactions
        .filter(
          (transaction) =>
            transaction.type === "expense" && transaction.category === budget.category
        )
        .reduce((sum, transaction) => sum + transaction.amount, 0);

      const usedPercent = budget.limit > 0 ? Math.min((spent / budget.limit) * 100, 100) : 0;

      return {
        ...budget,
        spent,
        usedPercent,
        remaining: Math.max(budget.limit - spent, 0),
      };
    });

    res.json({
      totals: {
        totalBalance,
        totalIncome,
        totalExpenses,
      },
      budgetByCategory,
      recentTransactions: transactions.slice(0, 10),
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
