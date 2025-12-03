// // backend/controllers/gameEventController.js
// import GameEvent from "../models/GameEvent.js";
// import Game from "../models/Game.js";
// import User from "../models/User.js";

// const VALID_EVENT_TYPES = [
//   "game_start",
//   "game_end",
//   "level_start",
//   "level_complete",
//   "level_fail",
// ];

// export const createGameEvent = async (req, res) => {
//   try {
//     const { userId, gameId, eventType, level, metadata } = req.body || {};

//     // Basic required fields
//     if (!userId || !gameId || !eventType) {
//       return res.status(400).json({
//         success: false,
//         message: "userId, gameId and eventType are required",
//       });
//     }

//     // Check event type
//     if (!VALID_EVENT_TYPES.includes(eventType)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid eventType",
//       });
//     }

//     // Fast parallel checks for user & game existence
//     const [user, game] = await Promise.all([
//       User.findById(userId).select("_id"),
//       Game.findById(gameId).select("_id"),
//     ]);

//     if (!user || !game) {
//       return res.status(404).json({
//         success: false,
//         message: "Invalid userId or gameId",
//       });
//     }

//     // Create event
//     const event = await GameEvent.create({
//       user: user._id,
//       game: game._id,
//       eventType,
//       level: typeof level === "number" ? level : level ?? null,
//       metadata: metadata || {},
//       timestamp: new Date(),
//     });

//     return res.json({
//       success: true,
//       eventId: event._id,
//     });
//   } catch (err) {
//     console.error("GAME EVENT ERROR:", err);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to record game event",
//     });
//   }
// };



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

/* ---------------------------------------------------
   CREATE EVENT  (NO CHANGE)
--------------------------------------------------- */
export const createGameEvent = async (req, res) => {
  try {
    const { userId, gameId, eventType, level, metadata } = req.body || {};

    if (!userId || !gameId || !eventType) {
      return res.status(400).json({
        success: false,
        message: "userId, gameId and eventType are required",
      });
    }

    if (!VALID_EVENT_TYPES.includes(eventType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid eventType",
      });
    }

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

    const event = await GameEvent.create({
      user: user._id,
      game: game._id,
      eventType,
      level: typeof level === "number" ? level : level ?? null,
      metadata: metadata || {},
      timestamp: new Date(),
    });

    return res.json({ success: true, eventId: event._id });

  } catch (err) {
    console.error("GAME EVENT ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to record game event",
    });
  }
};


/* ---------------------------------------------------
   1️⃣ GET ALL EVENTS (LIVE TRACKER)
--------------------------------------------------- */
export const getAllEvents = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 200;

    const events = await GameEvent.find({})
      .sort({ timestamp: -1 })
      .limit(limit)
      .populate("user", "name email")
      .populate("game", "title thumbnail slug");

    return res.json({ success: true, events });

  } catch (err) {
    return res.status(500).json({ success: false, message: "Error loading events" });
  }
};


/* ---------------------------------------------------
  2️⃣ GET EVENTS BY USER (User Timeline)
--------------------------------------------------- */
export const getEventsByUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const events = await GameEvent.find({ user: userId })
      .sort({ timestamp: 1 })
      .populate("game", "title slug thumbnail");

    return res.json({ success: true, events });

  } catch (err) {
    return res.status(500).json({ success: false, message: "Error loading user timeline" });
  }
};


/* ---------------------------------------------------
  3️⃣ GET EVENTS BY GAME (Optional)
--------------------------------------------------- */
export const getEventsByGame = async (req, res) => {
  try {
    const gameId = req.params.id;

    const events = await GameEvent.find({ game: gameId })
      .sort({ timestamp: -1 })
      .populate("user", "name email");

    return res.json({ success: true, events });

  } catch (err) {
    return res.status(500).json({ success: false, message: "Error loading game events" });
  }
};
