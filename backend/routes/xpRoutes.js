import express from "express";
import User from "../models/User.js";
import { protect } from "../middleware/authMiddleware.js";
 
const router = express.Router();

// Get logged-in user's XP + Level
router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "xp level weeklyStreak totalPlayTime"
    );

    return res.json({
      success: true,
      stats: user,
    });
  } catch (err) {
    console.error("XP ROUTE ERROR:", err);
    return res.status(500).json({ success: false });
  }
});

export default router;
