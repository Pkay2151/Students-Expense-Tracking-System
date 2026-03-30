const express = require("express");
const { nanoid } = require("nanoid");

const Budget = require("../models/Budget");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const budgets = await Budget.find({ userId: req.userId }).sort({ createdAt: 1 }).lean();
    res.json(budgets);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  const { category, limit, threshold = 80 } = req.body;

  if (!category || !limit) {
    return res.status(400).json({ message: "category and limit are required" });
  }

  const numericLimit = Number(limit);
  const numericThreshold = Number(threshold);

  if (Number.isNaN(numericLimit) || numericLimit <= 0) {
    return res.status(400).json({ message: "limit must be a positive number" });
  }

  try {
    const payload = {
      limit: numericLimit,
      threshold: Number.isNaN(numericThreshold) ? 80 : numericThreshold,
    };

    let budget = await Budget.findOne({ userId: req.userId, category });

    if (budget) {
      budget.limit = payload.limit;
      budget.threshold = payload.threshold;
      await budget.save();
      return res.json(budget);
    }

    budget = await Budget.create({
      id: nanoid(10),
      userId: req.userId,
      category,
      ...payload,
    });

    res.status(201).json(budget);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
