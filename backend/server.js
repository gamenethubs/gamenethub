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
// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import connectDB from "./config/db.js";
// import path from "path";
// import { fileURLToPath } from "url";

// dotenv.config();

// // Fix __dirname in ES modules
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const app = express();
// const PORT = process.env.PORT || 5000;

// /********************************************
//  * 1️⃣ CONNECT DATABASE BEFORE SERVER START
//  ********************************************/
// (async () => {
//   try {
//     await connectDB();
//   } catch (err) {
//     console.error("❌ MongoDB connection failed. Shutting down.");
//     process.exit(1);
//   }
// })();

// /********************************************
//  * 2️⃣ CORS CONFIG (LOCAL + PRODUCTION SAFELY)
//  ********************************************/
// const allowedOrigins = [
//   "http://localhost:5173",
//   "http://localhost:3000",
//   "https://gamenethub.netlify.app",     // ← ADD THIS EXACTLY
//   process.env.CLIENT_URL,
//   process.env.FRONTEND_URL,
// ].filter(Boolean);

// // app.use(
// //   cors({
// //     origin: allowedOrigins,
// //     credentials: true,
// //     methods: ["GET", "POST", "PUT", "DELETE"],
// //   })
// // );
// app.use(cors({
//   origin: function (origin, callback) {
//     if (!origin) return callback(null, true); // allow same-origin or server-to-server requests
//     if (allowedOrigins.indexOf(origin) !== -1) return callback(null, true);
//     return callback(new Error("CORS policy: Origin not allowed"), false);
//   },
//   credentials: true,
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
//   optionsSuccessStatus: 200
// }));

// // Ensure preflight OPTIONS are handled
// app.options("*", cors());


// /********************************************
//  * 3️⃣ JSON + FORM PARSER (LARGE FILES)
//  ********************************************/
// app.use(express.json({ limit: "200mb" }));
// app.use(express.urlencoded({ limit: "200mb", extended: true }));

// /********************************************
//  * 4️⃣ ROUTES
//  ********************************************/
// import authRoutes from "./routes/authRoutes.js";
// import gameRoutes from "./routes/gameRoutes.js";
// import favoriteRoutes from "./routes/favoriteRoutes.js";
// import { protect, adminOnly } from "./middleware/authMiddleware.js";

// app.use("/api/auth", authRoutes);
// app.use("/api/games", gameRoutes);
// app.use("/api/favorites", favoriteRoutes);

// /********************************************
//  * 5️⃣ PROTECTED TEST ENDPOINTS
//  ********************************************/
// app.get("/api/user/me", protect, (req, res) => {
//   res.json({ message: "Protected route accessed", user: req.user });
// });

// app.get("/api/admin/check", protect, adminOnly, (req, res) => {
//   res.json({ message: "Admin access confirmed ✔" });
// });

// /********************************************
//  * 6️⃣ STATIC FILES (RENDER PERSISTENT DISK SAFE)
//  ********************************************/

// // 100% correct → uploads survives after restart
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// // Serve extracted games (ZIP extractions)
// app.use("/games", express.static(path.join(__dirname, "uploads/games")));

// /********************************************
//  * 7️⃣ BASIC TEST
//  ********************************************/
// app.get("/test", (req, res) => {
//   res.json({ message: "Backend connected successfully!" });
// });

// /********************************************
//  * 8️⃣ START SERVER
//  ********************************************/
// app.listen(PORT, () => {
//   console.log(`🚀 Server running at http://localhost:${PORT}`);
//   console.log("🌍 Allowed Origins:", allowedOrigins);
//   console.log("📁 Serving uploads from:", path.join(__dirname, "uploads"));
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
// Use PORT provided by Render
const PORT = process.env.PORT || 5000;

/********************************************
 * 0️⃣ Helpful env debug (optional)
 ********************************************/
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("process.env.PORT:", process.env.PORT);
console.log("CLIENT_URL (raw):", process.env.CLIENT_URL);
console.log("FRONTEND_URL (raw):", process.env.FRONTEND_URL);

/********************************************
 * 1️⃣ JSON + FORM PARSER (LARGE FILES)
 ********************************************/
app.use(express.json({ limit: "200mb" }));
app.use(express.urlencoded({ limit: "200mb", extended: true }));

/********************************************
 * 2️⃣ CORS CONFIG (LOCAL + PRODUCTION SAFELY)
 ********************************************/
// Normalize allowed origins (remove trailing slashes if present)
const normalize = (u) => (u ? u.replace(/\/+$/, "") : u);

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://gamenethub.netlify.app", // ensure exact (no trailing slash)
  normalize(process.env.CLIENT_URL),
  normalize(process.env.FRONTEND_URL),
].filter(Boolean);

console.log("Allowed Origins (normalized):", allowedOrigins);

app.use((req, res, next) => {
  console.log("Incoming request origin:", req.headers.origin);
  next();
});

app.use(cors({
  origin: function (origin, callback) {
    // allow non-browser (server-to-server) or same-origin requests
    if (!origin) return callback(null, true);

    const normalizedOrigin = origin.replace(/\/+$/, "");
    if (allowedOrigins.indexOf(normalizedOrigin) !== -1) {
      return callback(null, true);
    }

    console.warn("Blocked CORS attempt from:", origin, "normalized:", normalizedOrigin);
    return callback(new Error("CORS policy: Origin not allowed"), false);
  },
  credentials: true, // keep true only if you need cookies/auth; otherwise set false
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  optionsSuccessStatus: 200
}));

// Ensure preflight OPTIONS are handled
app.options("*", cors());

/********************************************
 * 3️⃣ ROUTES
 ********************************************/
import authRoutes from "./routes/authRoutes.js";
import gameRoutes from "./routes/gameRoutes.js";
import favoriteRoutes from "./routes/favoriteRoutes.js";
import { protect, adminOnly } from "./middleware/authMiddleware.js";

app.use("/api/auth", authRoutes);
app.use("/api/games", gameRoutes);
app.use("/api/favorites", favoriteRoutes);

// Protected test endpoints
app.get("/api/user/me", protect, (req, res) => {
  res.json({ message: "Protected route accessed", user: req.user });
});
app.get("/api/admin/check", protect, adminOnly, (req, res) => {
  res.json({ message: "Admin access confirmed ✔" });
});

/********************************************
 * 4️⃣ STATIC FILES (RENDER PERSISTENT DISK SAFE)
 ********************************************/
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/games", express.static(path.join(__dirname, "uploads/games")));

/********************************************
 * 5️⃣ Health endpoint (Render-friendly)
 ********************************************/
app.get("/", (req, res) => {
  res.json({ success: true, message: "GamenetHub API running." });
});

app.get("/test", (req, res) => {
  res.json({ message: "Backend connected successfully!" });
});

/********************************************
 * 6️⃣ CONNECT DATABASE THEN START SERVER (use process.env.PORT & 0.0.0.0)
 ********************************************/
const startServer = async () => {
  try {
    await connectDB();
    const HOST = "0.0.0.0";
    const server = app.listen(PORT, HOST, () => {
      console.log(`🚀 Server listening at http://${HOST}:${PORT} (process.env.PORT=${process.env.PORT})`);
      console.log("📁 Serving uploads from:", path.join(__dirname, "uploads"));
    });

    // graceful shutdown
    process.on("unhandledRejection", (err) => {
      console.error("Unhandled Rejection:", err);
      server.close(() => process.exit(1));
    });
    process.on("uncaughtException", (err) => {
      console.error("Uncaught Exception:", err);
      server.close(() => process.exit(1));
    });
  } catch (err) {
    console.error("❌ Failed to connect DB or start server:", err);
    process.exit(1);
  }
};

startServer();
