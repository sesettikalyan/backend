// Connection.js
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

const connectToMongoDB = async () => {
  const url = process.env.MONGODB_URL;

  try {
    await mongoose.connect(url, {
      dbName: process.env.DB_NAME,
    });
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
};

module.exports = connectToMongoDB;
