import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getUserXPStats } from "../utils/xpSystem.js";

const router = express.Router();

/**************************************
 * ⭐ GET LOGGED-IN USER XP STATS
 **************************************/
router.get("/me", protect, async (req, res) => {
  try {
    const stats = await getUserXPStats(req.user._id);

    if (!stats) {
      return res.status(404).json({
        success: false,
        message: "User XP stats not found",
      });
    }

    return res.json({
      success: true,
      stats,
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
