const mongoose = require("mongoose");
const dns = require("node:dns");

// Use public DNS to ensure SRV resolution works reliably on Windows
try {
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
} catch (err) {
  // Ignore fallback error
}

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!uri) {
    throw new Error("MONGODB_URI (or MONGO_URI) is not defined in environment");
  }

  const conn = await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 15000,
    connectTimeoutMS: 15000,
  });
  console.log(`MongoDB Connected: ${conn.connection.host}`);
  return conn;
};

module.exports = connectDB;