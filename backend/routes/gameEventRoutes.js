// backend/routes/gameEventRoutes.js
import express from "express";
import { createGameEvent } from "../controllers/gameEventController.js";

const router = express.Router();

// Frontend games yahan POST karenge:
router.post("/event", createGameEvent);

export default router;
