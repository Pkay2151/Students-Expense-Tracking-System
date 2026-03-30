const mongoose = require("mongoose");

async function connectDb() {
  const mongoUri =
    process.env.MONGODB_URI || "mongodb+srv://Admin:AnTRmibp4hUynD8v@backenddb.soipk3m.mongodb.net/?appName=BackendDB";

  await mongoose.connect(mongoUri);
  console.log("MongoDB connected");
}

module.exports = connectDb;
