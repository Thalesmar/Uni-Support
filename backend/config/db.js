import mongoose from "mongoose";

const connectDb = async () => {
  const mongoUrl =
    process.env.MONGO_URL ||
    process.env.MONGODB_URI ||
    process.env.MONGO_URI;

  if (!mongoUrl) {
    console.error(
      "MongoDB connection string is missing. Set MONGO_URL in your environment.",
    );
    return false;
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  try {
    const conn = await mongoose.connect(mongoUrl, {
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      retryWrites: true,
    });

    console.log(`MongoDb successfully connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    return false;
  }
};

export default connectDb;
