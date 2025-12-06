import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getUserXPStats } from "../utils/xpSystem.js";
import User from "../models/User.js";

const router = express.Router();

/**************************************
 * ⭐ GET LOGGED-IN USER XP STATS
 **************************************/
router.get("/me", protect, async (req, res) => {
  try {
    // Fetch XP stats
    const stats = await getUserXPStats(req.user._id);

    const user = await User.findById(req.user._id)
      .select("weeklyStreak totalPlayTime badges");

    return res.json({
      success: true,
      stats: {
        ...stats,
        weeklyStreak: user.weeklyStreak,
        totalPlayTime: user.totalPlayTime,
        badges: user.badges,
      },
    });

  } catch (err) {
    console.error("XP ROUTE ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to load XP stats",
    });
  }
});


export default router;
