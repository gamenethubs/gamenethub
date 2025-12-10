import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getConversation, sendMessage } from "../controllers/chatController.js";

const router = express.Router();

router.use(protect);

router.get("/:friendId", getConversation);
router.post("/send", sendMessage);

export default router;
