const cors = require("cors");
const express = require("express");
const morgan = require("morgan");

const requireUser = require("./middleware/requireUser");
const healthRoutes = require("./routes/health");
const walletsRoutes = require("./routes/wallets");
const transactionsRoutes = require("./routes/transactions");
const budgetsRoutes = require("./routes/budgets");
const summaryRoutes = require("./routes/summary");
const profileRoutes = require("./routes/profile");

const app = express();

// Parse allowed origins from env or use defaults
const allowedOrigins = (process.env.FRONTEND_ORIGIN || "http://localhost:5173").split(",").map(o => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/health", healthRoutes);
app.use("/api", requireUser);
app.use("/api/wallets", walletsRoutes);
app.use("/api/transactions", transactionsRoutes);
app.use("/api/budgets", budgetsRoutes);
app.use("/api/summary", summaryRoutes);
app.use("/api/profile", profileRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
});

module.exports = app;
