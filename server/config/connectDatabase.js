import mongoose from "mongoose";

let connectionPromise;

export default async function connectDatabase() {
  if (mongoose.connection.readyState === 1) return mongoose.connection;
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI is not configured.");

  if (mongoose.connection.readyState === 2) {
    await mongoose.connection.asPromise();
    return mongoose.connection;
  }

  if (!connectionPromise) {
    connectionPromise = mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 })
      .then(() => mongoose.connection)
      .catch((error) => {
        connectionPromise = null;
        throw error;
      });
  }
  return connectionPromise;
}
