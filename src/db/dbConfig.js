import mongoose from "mongoose";

// Type definition charai caching
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export const connectDB = async () => {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const opts = {
      dbName: "kfDB",
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(process.env.MONGODB_URI, opts).then((m) => m.connection);
  }
  cached.conn = await cached.promise;
  return cached.conn;
};