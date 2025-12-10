import mongoose from "mongoose";
import ChatMessage from "../models/ChatMessage.js";
import User from "../models/User.js";

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

const getUserIdFromReq = (req) => {
  if (!req) return null;
  if (req.user) return req.user.id || req.user._id || req.user.userId || null;
  return null;
};

// ✅ FRIEND ONLY CHECK
async function ensureFriendship(currentUserId, friendId) {
  if (!currentUserId || !friendId) return false;

  const user = await User.findById(currentUserId).select("friends").lean();
  if (!user) return false;

  return (user.friends || []).some(
    (f) => f.toString() === friendId.toString()
  );
}

// ✅ GET CHAT
export const getConversation = async (req, res) => {
  try {
    const currentUserId = getUserIdFromReq(req);
    const { friendId } = req.params;

    if (!currentUserId) return res.status(401).json({ message: "Unauthorized" });

    if (!mongoose.Types.ObjectId.isValid(friendId))
      return res.status(400).json({ message: "Invalid friend id" });

    if (currentUserId.toString() === friendId.toString())
      return res.status(400).json({ message: "Cannot chat with yourself" });

    const isFriend = await ensureFriendship(currentUserId, friendId);
    if (!isFriend)
      return res.status(403).json({ message: "Chat allowed only between friends" });

    const cutoff = new Date(Date.now() - ONE_DAY_MS);

    const messages = await ChatMessage.find({
      participants: { $all: [currentUserId, friendId] },
      createdAt: { $gte: cutoff },
    }).sort({ createdAt: 1 }).lean();

    res.json({ messages });
  } catch (err) {
    console.error("GET CHAT ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ SEND CHAT
export const sendMessage = async (req, res) => {
  try {
    const fromId = getUserIdFromReq(req);
    const { toUserId, text } = req.body || {};

    if (!fromId) return res.status(401).json({ message: "Unauthorized" });

    if (!toUserId || !text || !text.trim())
      return res.status(400).json({ message: "toUserId and text required" });

    if (!mongoose.Types.ObjectId.isValid(toUserId))
      return res.status(400).json({ message: "Invalid toUserId" });

    if (fromId.toString() === toUserId.toString())
      return res.status(400).json({ message: "Cannot chat with yourself" });

    const isFriend = await ensureFriendship(fromId, toUserId);
    if (!isFriend)
      return res.status(403).json({ message: "Chat allowed only between friends" });

    const participants = [fromId, toUserId];

    const msg = await ChatMessage.create({
      from: fromId,
      to: toUserId,
      text: text.trim(),
      participants,
    });

    res.status(201).json({ message: msg });
  } catch (err) {
    console.error("SEND CHAT ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
