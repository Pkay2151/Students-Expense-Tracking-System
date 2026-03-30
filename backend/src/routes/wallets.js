const express = require("express");
const { listWallets, createWallet } = require("../controllers/walletController");

const router = express.Router();

router.get("/", listWallets);
router.post("/", createWallet);

module.exports = router;
