// // backend/server.js
// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import connectDB from "./config/db.js";
// import path from "path";
// import { fileURLToPath } from "url";
// import contactRoutes from "./routes/contactRoutes.js";

// // ⭐ ADDED
// import subscriberRoutes from "./routes/subscriberRoutes.js";

// // ⭐ NEW — REQUIRED FOR SOCKET.IO
// import http from "http";
// import { Server } from "socket.io";
// import multiplayerHandler from "./socket/multiplayerHandler.js"; // ⭐ NEW

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
//  * 2️⃣ CORS CONFIG
//  ********************************************/
// const allowedOrigins = [
//   "http://localhost:5173",
//   "http://localhost:3000",
//   "https://gamenethub.netlify.app",
//   "https://gamenethub.com",
//   process.env.CLIENT_URL,
//   process.env.FRONTEND_URL,
// ].filter(Boolean);

// app.use(
//   cors({
//     origin: allowedOrigins,
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE"],
//   })
// );

// /********************************************
//  * 3️⃣ JSON + FORM PARSER
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
// app.use("/api/contact", contactRoutes);

// // ⭐ Newsletter subscribe route
// app.use("/api/subscribe", subscriberRoutes);

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
//  * 6️⃣ STATIC FILES — UPDATED FOR PERSISTENT DISK
//  ********************************************/
// app.use("/uploads", express.static(process.env.UPLOAD_PATH));
// app.use("/games", express.static(process.env.GAME_PATH));

// /********************************************
//  * 7️⃣ BASIC TEST
//  ********************************************/
// app.get("/test", (req, res) => {
//   res.json({ message: "Backend connected successfully!" });
// });

// /********************************************
//  * ⭐ NEW SECTION — SOCKET.IO SERVER
//  * (COMPLETELY SAFE — DOES NOT TOUCH OLD CODE)
//  ********************************************/

// // Create HTTP server to attach socket.io   ⭐ NEW
// const server = http.createServer(app);

// // Create Socket.IO instance                 ⭐ NEW
// const io = new Server(server, {
//   cors: {
//     origin: allowedOrigins,
//     methods: ["GET", "POST"],
//   },
// });

// // Attach multiplayer handlers               ⭐ NEW
// multiplayerHandler(io);

// /********************************************
//  * 8️⃣ START SERVER (CHANGED FROM app.listen → server.listen)
//  ********************************************/
// server.listen(PORT, () => {
//   console.log(`🚀 Server running at http://localhost:${PORT}`);
//   console.log("🌍 Allowed Origins:", allowedOrigins);
//   console.log("📁 Serving uploads from:", process.env.UPLOAD_PATH);
//   console.log("Server listening on port", PORT);
// });


// backend/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import path from "path";
import { fileURLToPath } from "url";
import contactRoutes from "./routes/contactRoutes.js";

// ⭐ ADDED
import subscriberRoutes from "./routes/subscriberRoutes.js";

// ⭐ NEW — REQUIRED FOR SOCKET.IO
import http from "http";
import { Server } from "socket.io";
import multiplayerHandler from "./socket/multiplayerHandler.js"; // ⭐ NEW

// ⭐ NEW — TRACKER FILE GENERATOR
import createTrackerFile from "./utils/createTrackerFile.js";

// ⭐ NEW — GAME EVENT ROUTES
import gameEventRoutes from "./routes/gameEventRoutes.js";

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
 * 2️⃣ CORS CONFIG
 ********************************************/
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://gamenethub.netlify.app",
  "https://gamenethub.com",
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
 * 3️⃣ JSON + FORM PARSER
 ********************************************/
app.use(express.json({ limit: "200mb" }));
app.use(express.urlencoded({ limit: "200mb", extended: true }));

// ⭐ NEW — ENSURE tracker.js EXISTS ON PERSISTENT DISK
createTrackerFile();

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
app.use("/api/contact", contactRoutes);

// ⭐ Newsletter subscribe route
app.use("/api/subscribe", subscriberRoutes);

// ⭐ NEW — GAME TRACKING API
app.use("/api/game", gameEventRoutes);

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
 * 6️⃣ STATIC FILES — UPDATED FOR PERSISTENT DISK
 ********************************************/
app.use("/uploads", express.static(process.env.UPLOAD_PATH));
app.use("/games", express.static(process.env.GAME_PATH));

/********************************************
 * 7️⃣ BASIC TEST
 ********************************************/
app.get("/test", (req, res) => {
  res.json({ message: "Backend connected successfully!" });
});

/********************************************
 * ⭐ NEW SECTION — SOCKET.IO SERVER
 * (COMPLETELY SAFE — DOES NOT TOUCH OLD CODE)
 ********************************************/

// Create HTTP server to attach socket.io   ⭐ NEW
const server = http.createServer(app);

// Create Socket.IO instance                 ⭐ NEW
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
  },
});

app.use((req, res, next) => {
  req.io = io;
  next();
});

// Attach multiplayer handlers               ⭐ NEW
multiplayerHandler(io);

/********************************************
 * 8️⃣ START SERVER (CHANGED FROM app.listen → server.listen)
 ********************************************/
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log("🌍 Allowed Origins:", allowedOrigins);
  console.log("📁 Serving uploads from:", process.env.UPLOAD_PATH);
  console.log("Server listening on port", PORT);
});
