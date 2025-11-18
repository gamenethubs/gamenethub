// // backend/config/db.js
// import mongoose from "mongoose";

// const connectDB = async () => {
//   try {
//     // Remove deprecated warnings
//     mongoose.set("strictQuery", false);

//     const uri = process.env.MONGO_URI;
//     console.log("🔌 Connecting to MongoDB Atlas...");

//     const conn = await mongoose.connect(uri);

//     console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
//   } catch (error) {
//     console.error("❌ MongoDB Connection Error:", error.message);
//     process.exit(1);
//   }
// };

// export default connectDB;


// backend/config/db.js
import mongoose from "mongoose";

const connectDB = async (retries = 5, delay = 2000) => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error("❌ ERROR: MONGO_URI is missing in .env");
    process.exit(1);
  }

  console.log("🔌 Connecting to MongoDB Atlas...");
  console.log("🌐 Cluster:", uri.split("@")[1]?.split("/")[0] || "Unknown");

  try {
    mongoose.set("strictQuery", false);

    // Render-safe recommended configs
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 15000, // handles render cold starts
      connectTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 1,
      family: 4, // Force IPv4 (Atlas prefers this)
    });

    console.log(`✅ MongoDB Connected → ${conn.connection.host}`);

    // Events for stability
    mongoose.connection.on("disconnected", () => {
      console.log("⚠️ MongoDB Disconnected! Retrying...");
      connectDB();
    });

    mongoose.connection.on("reconnectFailed", () => {
      console.log("❌ Reconnect Failed!");
    });

  } catch (err) {
    console.error(`❌ MongoDB Connection Error: ${err.message}`);

    if (retries > 0) {
      console.log(`⏳ Retrying in ${delay}ms (${retries - 1} retries left)...`);
      await new Promise((res) => setTimeout(res, delay));
      return connectDB(retries - 1, delay);
    }

    console.error("💀 All connection attempts failed. Exiting...");
    process.exit(1);
  }
};

// Prevent unhandled crashes
process.on("unhandledRejection", (err) => {
  console.error("🔥 Unhandled Rejection:", err);
});

process.on("uncaughtException", (err) => {
  console.error("🔥 Uncaught Exception:", err);
});

export default connectDB;
