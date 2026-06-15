import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

if (!process.env.MONGODB_URL) {
  throw new Error("MONGODB_URL is not defined");
}

let isConnected = false;

async function connectDB() {
  if (isConnected) return;

  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
    });

    isConnected = true;
    console.log("Kết nối MongoDB thành công!");
  } catch (error) {
    console.log("Lỗi kết nối MongoDB", error);
    process.exit(1);
  }
}

export default connectDB;
