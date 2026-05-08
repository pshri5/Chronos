import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  console.log(`Connecting to MongoDB at: ${uri}`);
  
  if (!uri) {
    throw new Error("MONGODB_URI is not defined in environment variables");
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000, // Fail fast if cannot connect
    });
    console.log("Successfully connected to MongoDB");
  } catch (error: any) {
    console.error("MongoDB Connection Error:", error.message);
    throw error;
  }
};

export const disconnectDB = async () => {
  await mongoose.disconnect();
};

export const clearDatabase = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
};
