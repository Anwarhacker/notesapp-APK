const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/notesapp",
      {
        serverSelectionTimeoutMS: 30000, // Increase timeout to 30s
        socketTimeoutMS: 45000,
      }
    );

    console.log("MongoDB connected");

    // Add connection event listeners for debugging
    mongoose.connection.on("connected", () =>
      console.log("Mongoose connected to MongoDB")
    );
    mongoose.connection.on("error", (err) =>
      console.log("Mongoose connection error:", err)
    );
    mongoose.connection.on("disconnected", () =>
      console.log("Mongoose disconnected")
    );

    return conn;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
