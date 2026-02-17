const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      console.error("Error: MONGODB_URI is not defined in environment variables");
      process.exit(1);
    }
    
    await mongoose.connect(mongoURI);
    console.log("MongoDB Atlas connected successfully");
  } catch (err) {
    console.error("DB connection error:", err);
    process.exit(1);
  }
};

module.exports = connectDB;
