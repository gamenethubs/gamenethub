// backend/controllers/gameEventController.js
import GameEvent from "../models/GameEvent.js";
import Game from "../models/Game.js";
import User from "../models/User.js";

const VALID_EVENT_TYPES = [
  "game_start",
  "game_end",
  "level_start",
  "level_complete",
  "level_fail",
];

export const createGameEvent = async (req, res) => {
  try {
    const { userId, gameId, eventType, level, metadata } = req.body || {};

    // Basic required fields
    if (!userId || !gameId || !eventType) {
      return res.status(400).json({
        success: false,
        message: "userId, gameId and eventType are required",
      });
    }

    // Check event type
    if (!VALID_EVENT_TYPES.includes(eventType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid eventType",
      });
    }

    // Fast parallel checks for user & game existence
    const [user, game] = await Promise.all([
      User.findById(userId).select("_id"),
      Game.findById(gameId).select("_id"),
    ]);

    if (!user || !game) {
      return res.status(404).json({
        success: false,
        message: "Invalid userId or gameId",
      });
    }

    // Create event
    const event = await GameEvent.create({
      user: user._id,
      game: game._id,
      eventType,
      level: typeof level === "number" ? level : level ?? null,
      metadata: metadata || {},
      timestamp: new Date(),
    });

    return res.json({
      success: true,
      eventId: event._id,
    });
  } catch (err) {
    console.error("GAME EVENT ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to record game event",
    });
  }
};
