// // backend/server.js
// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import connectDB from "./config/db.js";
// import path from "path";

// dotenv.config();

// // Connect MongoDB
// connectDB();

// const app = express();
// const PORT = process.env.PORT || 5000;

// /**************************************
//  *  CORS FIX (VERY IMPORTANT)
//  **************************************/
// app.use(
//   cors({
//     origin: ["http://localhost:5173", "http://localhost:3000"],
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     credentials: true,
//   })
// );

// /**************************************
//  *  EXPRESS MIDDLEWARE
//  **************************************/
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// /**************************************
//  *  ROUTES IMPORT
//  **************************************/
// import authRoutes from "./routes/authRoutes.js";
// import gameRoutes from "./routes/gameRoutes.js";
// import favoriteRoutes from "./routes/favoriteRoutes.js";
// import { protect, adminOnly } from "./middleware/authMiddleware.js";

// /**************************************
//  *  API ROUTES (MUST COME BEFORE STATIC)
//  **************************************/
// app.use("/api/auth", authRoutes);
// app.use("/api/games", gameRoutes);
// app.use("/api/favorites", favoriteRoutes);

// /**************************************
//  *  PROTECTED TEST ROUTES
//  **************************************/
// app.get("/api/user/me", protect, (req, res) => {
//   res.json({
//     message: "Protected route accessed",
//     user: req.user,
//   });
// });

// app.get("/api/admin/check", protect, adminOnly, (req, res) => {
//   res.json({ message: "You are an Admin ✔" });
// });

// /**************************************
//  *  BASIC TEST ROUTE
//  **************************************/
// app.get("/test", (req, res) => {
//   res.json({ message: "Backend connected successfully!" });
// });

// /**************************************
//  *  STATIC ROUTES — ALWAYS AT BOTTOM
//  **************************************/
// app.use("/uploads", express.static("uploads"));
// app.use("/games", express.static("public/games"));

// /**************************************
//  *  START SERVER
//  **************************************/
// app.listen(PORT, () => {
//   console.log(`🚀 Server running at http://localhost:${PORT}`);
// });

// backend/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

/********************************************
 * 1️⃣ CONNECT DATABASE BEFORE SERVER START
 ********************************************/
(async () => {
  try {
    await connectDB();
  } catch (err) {
    console.error("❌ MongoDB connection failed. Shutting down.");
    process.exit(1);
  }
})();

/********************************************
 * 2️⃣ CORS CONFIG (LOCAL + PRODUCTION SAFELY)
 ********************************************/
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.CLIENT_URL,
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

/********************************************
 * 3️⃣ JSON + FORM PARSER (LARGE FILES)
 ********************************************/
app.use(express.json({ limit: "200mb" }));
app.use(express.urlencoded({ limit: "200mb", extended: true }));

/********************************************
 * 4️⃣ ROUTES
 ********************************************/
import authRoutes from "./routes/authRoutes.js";
import gameRoutes from "./routes/gameRoutes.js";
import favoriteRoutes from "./routes/favoriteRoutes.js";
import { protect, adminOnly } from "./middleware/authMiddleware.js";

app.use("/api/auth", authRoutes);
app.use("/api/games", gameRoutes);
app.use("/api/favorites", favoriteRoutes);

/********************************************
 * 5️⃣ PROTECTED TEST ENDPOINTS
 ********************************************/
app.get("/api/user/me", protect, (req, res) => {
  res.json({ message: "Protected route accessed", user: req.user });
});

app.get("/api/admin/check", protect, adminOnly, (req, res) => {
  res.json({ message: "Admin access confirmed ✔" });
});

/********************************************
 * 6️⃣ STATIC FILES (RENDER PERSISTENT DISK SAFE)
 ********************************************/

// 100% correct → uploads survives after restart
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Serve extracted games (ZIP extractions)
app.use("/games", express.static(path.join(__dirname, "uploads/games")));

/********************************************
 * 7️⃣ BASIC TEST
 ********************************************/
app.get("/test", (req, res) => {
  res.json({ message: "Backend connected successfully!" });
});

/********************************************
 * 8️⃣ START SERVER
 ********************************************/
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log("🌍 Allowed Origins:", allowedOrigins);
  console.log("📁 Serving uploads from:", path.join(__dirname, "uploads"));
});

