import mongoose from "mongoose";

const connectDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);

    if (conn) {
      return console.log(
        `MongoDb successfully connected: ${conn.connection.host}`,
      );
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    // process.exist(1);
  }
};

export default connectDb;
