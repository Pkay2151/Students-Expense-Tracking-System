require("dotenv").config();

const app = require("./app");
const connectDb = require("./config/db");

const port = Number(process.env.PORT) || 5000;

async function startServer() {
  try {
    await connectDb();
    app.listen(port, () => {
      console.log(`Backend API running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Failed to start backend:", error.message);
    process.exit(1);
  }
}

startServer();
