// // backend/routes/gameEventRoutes.js
// import express from "express";
// import { createGameEvent } from "../controllers/gameEventController.js";

// const router = express.Router();

// // Frontend games yahan POST karenge:
// router.post("/event", createGameEvent);

// export default router;


// backend/routes/gameEventRoutes.js
import express from "express";
import {
  createGameEvent,
  getAllEvents,
  getEventsByUser,
  getEventsByGame,
} from "../controllers/gameEventController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ----------------------------------------------
   1️⃣ FRONTEND GAMES → SEND EVENTS
---------------------------------------------- */
router.post("/event", createGameEvent);

/* ----------------------------------------------
   2️⃣ ADMIN LIVE TRACKER (SECURED)
---------------------------------------------- */
router.get("/events", protect, adminOnly, getAllEvents);

/* ----------------------------------------------
   3️⃣ TIMELINE: EVENTS OF A SPECIFIC USER (SECURED)
---------------------------------------------- */
router.get("/events/user/:id", protect, adminOnly, getEventsByUser);

/* ----------------------------------------------
   4️⃣ GAME-SPECIFIC EVENTS (SECURED, OPTIONAL)
---------------------------------------------- */
router.get("/events/game/:id", protect, adminOnly, getEventsByGame);

export default router;
