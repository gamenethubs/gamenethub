// // backend/seedAdmin.js
// import dotenv from "dotenv";
// import mongoose from "mongoose";
// import bcrypt from "bcryptjs";
// import User from "./models/User.js";
// import connectDB from "./config/db.js";

// dotenv.config();

// // MONGO CONNECT
// await connectDB();

// // ADMIN DETAILS (tum yahan change kar sakte ho)
// const adminData = {
//   name: "Super Admin",
//   email: "admin@gameland.com",
//   password: "Admin@123", // default password
//   role: "admin",
// };

// async function seedAdmin() {
//   try {
//     // Check if admin already exists
//     const adminExists = await User.findOne({ email: adminData.email });

//     if (adminExists) {
//       console.log("❗ Admin already exists:", adminExists.email);
//       process.exit(0);
//     }

//     // Hash password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPass = await bcrypt.hash(adminData.password, salt);

//     // Create new admin
//     const admin = await User.create({
//       name: adminData.name,
//       email: adminData.email,
//       password: hashedPass,
//       role: "admin",
//     });

//     console.log("✅ Admin Created Successfully!");
//     console.log("Login Email:", admin.email);
//     console.log("Login Password:", adminData.password);

//     process.exit(0);
//   } catch (err) {
//     console.error("❌ Seeding Failed:", err);
//     process.exit(1);
//   }
// }

// seedAdmin();

// backend/seedAdmin.js
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import User from "./models/User.js";
import connectDB from "./config/db.js";

dotenv.config();

/********************************************
 * SAFE EXIT FUNCTION (Render Friendly)
 ********************************************/
const safeExit = async (code) => {
  try {
    await mongoose.connection.close();
  } catch (err) {
    console.error("⚠ Could not close connection:", err.message);
  }
  process.exit(code);
};

async function seedAdmin() {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await connectDB();

    /********************************************
     * Ensure JWT_SECRET exists
     ********************************************/
    if (!process.env.JWT_SECRET) {
      console.error("❌ ERROR: JWT_SECRET missing in .env");
      return safeExit(1);
    }

    const adminData = {
      name: "Super Admin",
      email: "admin@gamenethub.com",
      password: "Admin@123", // Default safe password
      role: "admin",
    };

    /********************************************
     * Check for existing admin
     ********************************************/
    const existing = await User.findOne({ email: adminData.email });

    if (existing) {
      console.log("ℹ️ Admin already exists:", existing.email);
      return safeExit(0);
    }

    /********************************************
     * Create new admin
     ********************************************/
    const hashedPassword = await bcrypt.hash(adminData.password, 12);

    const admin = await User.create({
      name: adminData.name,
      email: adminData.email,
      password: hashedPassword,
      role: "admin",
      avatar: null, // future-proofing
    });

    console.log("✅ ADMIN CREATED SUCCESSFULLY!");
    console.log("---------------------------------");
    console.log("📧 Email:    ", admin.email);
    console.log("🔑 Password: ", adminData.password);
    console.log("---------------------------------");

    return safeExit(0);

  } catch (err) {
    console.error("❌ SEEDING FAILED:", err.message);
    return safeExit(1);
  }
}

// RUN SCRIPT
seedAdmin();
