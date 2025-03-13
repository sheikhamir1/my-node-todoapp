import mongoose from "mongoose";

export const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_CLUSTER);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.log(`MongoDB connection failed due to ${error}`);
  }
};

export const connectLocalMongoDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_LOCAL);
    console.log("MongoDB local connected successfully");
  } catch (error) {
    console.log(`MongoDB connection failed due to ${error}`);
  }
};
