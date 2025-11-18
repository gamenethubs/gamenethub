// import mongoose from "mongoose";
// import dotenv from "dotenv";
// dotenv.config();

// (async () => {
//   try {
//     console.log("Connecting to:", process.env.MONGO_URI);
//     await mongoose.connect(process.env.MONGO_URI);
//     console.log("🎉 Connected Successfully!");
//     process.exit(0);
//   } catch (err) {
//     console.error("❌ Test error:", err.message);
//     process.exit(1);
//   }
// })();

// backend/testMongo.js
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

/************************************
 * SAFETY: Validate Mongo URI
 ************************************/
const MONGO = process.env.MONGO_URI;

console.log("🔍 Testing MongoDB Connection...");

if (!MONGO) {
  console.error("❌ ERROR: MONGO_URI missing in .env");
  process.exit(1);
}

// Mask sensitive info
try {
  const masked = MONGO.replace(/:\/\/(.*?):(.*?)@/, "://****:****@");
  console.log("📡 URI:", masked);
} catch {
  console.log("📡 Mongo URI Loaded");
}

/************************************
 * MAIN TEST FUNCTION
 ************************************/
(async () => {
  try {
    const conn = await mongoose.connect(MONGO, {
      serverSelectionTimeoutMS: 8000, // Faster fail for testing
      connectTimeoutMS: 8000,
    });

    console.log("\n✅ MongoDB Connected Successfully!");
    console.log("🌐 Host:", conn.connection.host);
    console.log("📁 Database:", conn.connection.name);
    console.log("🔒 Driver:", mongoose.version);
    console.log("🟢 Status: OK\n");

    await mongoose.connection.close();
    process.exit(0);

  } catch (err) {
    console.log("\n❌ MongoDB Connection FAILED!");
    console.log("🔎 Message:", err.message);
    console.log("📌 Full Error Code:", err.code || "N/A");

    console.log(`
-------------------------------------------
🔧 TROUBLESHOOTING CHECKLIST (MongoDB Atlas)
-------------------------------------------
1) IP whitelist → Set to: 0.0.0.0/0 (Allow all)
2) Username & Password → Check again
3) Cluster state → Must be RUNNING, not PAUSED
4) Network issues → Turn OFF VPN / firewall
5) If using Render → Enable outbound access
6) DNS issues → Try:
   nslookup <cluster-hostname>
7) Replace SRV URI with standard one:
   mongodb://username:pwd@host/db?retryWrites=true&w=majority
-------------------------------------------
    `);

    try {
      await mongoose.connection.close();
    } catch {}

    process.exit(1);
  }
})();
