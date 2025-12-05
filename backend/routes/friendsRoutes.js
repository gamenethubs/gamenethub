/****************************************
 * backend/routes/friendsRoutes.js
 *****************************************/
import express from "express";
import { protect } from "../middleware/authMiddleware.js";

import {
  sendRequest,
  cancelRequest,
  acceptRequest,
  rejectRequest,
  removeFriend,
  getFriends,
} from "../controllers/friendsController.js";

const router = express.Router();

// SEARCH users handled by userRoutes (already done)

// FRIEND SYSTEM MAIN ROUTES
router.post("/request", protect, sendRequest);
router.post("/request/cancel", protect, cancelRequest);
router.post("/request/accept", protect, acceptRequest);
router.post("/request/reject", protect, rejectRequest);

router.post("/remove", protect, removeFriend);

router.get("/list", protect, getFriends);

export default router;
