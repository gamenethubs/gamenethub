// backend/routes/userRoutes.js
import express from "express";
import {
  getMyProfile,
  updateProfile,
  searchUsers,
  getPublicProfile,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/************************************
 * 🔹 GET MY PROFILE
 ************************************/
router.get("/me", protect, getMyProfile);

/************************************
 * 🔹 UPDATE PROFILE
 * (name, username, avatar, bio, social)
 ************************************/
router.put("/update", protect, updateProfile);

/************************************
 * 🔹 SEARCH USERS BY USERNAME
 ************************************/
router.get("/search", protect, searchUsers);

/************************************
 * 🔹 GET PUBLIC PROFILE BY USERNAME
 ************************************/
router.get("/:username", protect, getPublicProfile);

export default router;
