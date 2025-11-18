// import express from "express";
// import { protect } from "../middleware/authMiddleware.js";
// import {
//   toggleFavorite,
//   getUserFavorites
// } from "../controllers/favoriteController.js";

// const router = express.Router();

// router.post("/toggle/:gameId", protect, toggleFavorite);

// router.get("/my-favorites", protect, getUserFavorites);

// export default router;


// backend/routes/favoriteRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  toggleFavorite,
  getUserFavorites,
} from "../controllers/favoriteController.js";

const router = express.Router();

/************************************
 * FAVORITES ROUTES (Protected)
 ************************************/

// Add/Remove Favorite (Toggle)
router.post("/toggle/:gameId", protect, toggleFavorite);

// Get User Favorite Games
router.get("/my-favorites", protect, getUserFavorites);

export default router;


