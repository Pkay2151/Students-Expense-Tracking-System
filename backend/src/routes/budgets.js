const express = require("express");
const { listBudgets, upsertBudget } = require("../controllers/budgetController");

const router = express.Router();

router.get("/", listBudgets);
router.post("/", upsertBudget);

module.exports = router;
