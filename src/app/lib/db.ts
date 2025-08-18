import mongoose from "mongoose";
import "./models";

interface Cached {
  conn: mongoose.Connection | null;
  promise: Promise<mongoose.Connection> | null;
}

// Use a module-scoped variable instead of global
const cached: Cached = {
  conn: null,
  promise: null,
};

export async function connectToDatabase(): Promise<mongoose.Connection> {
  // If connection exists, return it
  if (cached.conn) {
    return cached.conn;
  }

  // If connection promise doesn't exist, create it
  if (!cached.promise) {
    const opts = {
      bufferCommands: true,
      serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
      connectTimeoutMS: 30000, // Increase connection timeout
      socketTimeoutMS: 45000,
    };

    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error(
        "MONGODB_URI is not defined. Ensure it is set in .env.local or environment variables."
      );
    }
    cached.promise = mongoose.connect(uri, opts).then((mongoose) => {
      console.log("[DB] MongoDB connected successfully");
      return mongoose.connection;
    });
  }

  try {
    // Await the connection
    cached.conn = await cached.promise;
  } catch (e) {
    // Reset promise on error to allow retrying
    cached.promise = null;
    console.error("[DB] MongoDB connection error:", e);

    // Return a more user-friendly error
    const error = new Error(
      "Could not connect to MongoDB. Please check your connection string and make sure your database is running."
    );
    error.name = "MongoConnectionError";
    throw error;
  }

  return cached.conn;
}
