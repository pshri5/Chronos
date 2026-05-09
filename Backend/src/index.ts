import { connectDB } from "./db/index.js";
import app from "./app.js";
import { jobQueueService } from "./services/jobQueueService.js";
import dotenv from "dotenv";
import mongoose from "mongoose";

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 8000;

// Start server only when DB connection is established
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`⚙️  Server is running at http://localhost:${PORT}`);
      
      // Start the job queue worker after server starts
      jobQueueService.start();
    });
  } catch (error) {
    console.log("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

// Handle graceful shutdown
process.on("SIGINT", async () => {
  console.log("\nShutting down gracefully...");
  // Stop the job queue worker
  jobQueueService.stop();
  await mongoose.disconnect();
  process.exit(0);
});