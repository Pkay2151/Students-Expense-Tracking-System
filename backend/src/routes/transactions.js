const express = require("express");
const {
  listTransactions,
  createTransaction,
  transferFunds,
} = require("../controllers/transactionController");

const router = express.Router();

router.get("/", listTransactions);
router.post("/", createTransaction);
router.post("/transfer", transferFunds);

module.exports = router;
