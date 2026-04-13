import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let isConnected = false; // Track connection globally for serverless hot caching

export const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      console.warn("MONGODB_URI is undefined. Database connection skipped.");
      return;
    }
    
    // Serverless-specific mongoose settings 
    const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000, // Drop from 10000ms base wait for faster erroring
    });
    
    isConnected = true;
    console.log(`MongoDB Connected: ${conn.connection.host} (Serverless)`);
  } catch (error: any) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    // Do not process.exit(1) on Vercel
  }
};
