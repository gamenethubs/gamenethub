// // backend/routes/gameRoutes.js
// import express from "express";
// import {
//   getAllGames,
//   getGameById,
//   getGameBySlug,
//   createGame,
//   updateGame,
//   deleteGame,
//   increasePlayCount,
//   rateGame,
// } from "../controllers/gameController.js";

// import { protect, adminOnly } from "../middleware/authMiddleware.js";
// import { uploadFiles } from "../middleware/uploadMiddleware.js";

// const router = express.Router();

// /******************************************
//  * ⭐ PUBLIC ROUTES
//  ******************************************/

// // Fetch all games
// router.get("/", getAllGames);

// // Fetch by ID
// router.get("/id/:id", getGameById);

// // Fetch by Slug
// router.get("/slug/:slug", getGameBySlug);

// /******************************************
//  * ⭐ GAME INTERACTIONS (PUBLIC + AUTH)
//  ******************************************/

// // Play count (no login required)
// router.post("/:id/play", increasePlayCount);

// // Rating (login required)
// router.post("/:id/rate", protect, rateGame);

// /******************************************
//  * ⭐ ADMIN ROUTES
//  ******************************************/

// // Create new game
// router.post("/", protect, adminOnly, uploadFiles, createGame);

// // Update game
// router.put("/:id", protect, adminOnly, uploadFiles, updateGame);

// // Delete game
// router.delete("/:id", protect, adminOnly, deleteGame);

// export default router;

// backend/routes/gameRoutes.js
import express from "express";
import {
  getAllGames,
  getGameById,
  getGameBySlug,
  createGame,
  updateGame,
  deleteGame,
  increasePlayCount,
  rateGame,
} from "../controllers/gameController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { uploadFiles } from "../middleware/uploadMiddleware.js";

const router = express.Router();

/************************************
 * ⭐ PUBLIC ROUTES
 ************************************/

// Fetch all games
router.get("/", getAllGames);

// Fetch game by database ID
router.get("/id/:id", getGameById);

// Fetch game by slug
router.get("/slug/:slug", getGameBySlug);


/************************************
 * ⭐ GAME INTERACTIONS
 ************************************/

// Increase play count (no login)
router.post("/:id/play", increasePlayCount);

// Rate a game (login required)
router.post("/:id/rate", protect, rateGame);


/************************************
 * ⭐ ADMIN ROUTES
 ************************************/

// Create a new game (thumbnail + ZIP upload)
router.post(
  "/",
  protect,
  adminOnly,
  (req, res, next) => {
    uploadFiles(req, res, (err) => {
      if (err) return next(err);
      next();
    });
  },
  createGame
);

// Update game
router.put(
  "/:id",
  protect,
  adminOnly,
  (req, res, next) => {
    uploadFiles(req, res, (err) => {
      if (err) return next(err);
      next();
    });
  },
  updateGame
);

// Delete game
router.delete("/:id", protect, adminOnly, deleteGame);


/************************************
 * ⭐ GLOBAL UPLOAD ERROR HANDLER
 *    Prevents Render crash
 ************************************/
router.use((err, req, res, next) => {
  console.error("🔥 MULTER / UPLOAD ERROR:", err.message);

  // Large file size error
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({
      success: false,
      message: "File too large — Max allowed is 200MB",
    });
  }

  // Multer filter error (invalid file type)
  if (err instanceof Error) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  return res.status(500).json({
    success: false,
    message: "File upload failed",
  });
});

export default router;

