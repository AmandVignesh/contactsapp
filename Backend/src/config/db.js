import mongoose from "mongoose";

export async function connectDB(url) {
  try {
    await mongoose.connect(url);
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1); 
  }
}
