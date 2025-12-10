///////socket/chathandler.js///////////

import mongoose from "mongoose";
import ChatMessage from "../models/ChatMessage.js";
import jwt from "jsonwebtoken";


function getUserIdFromSocket(socket) {
  const auth = socket.handshake?.auth || {};
  const token = auth.token;

  // ✅ 1. Direct userId agar frontend ne bhej diya
  if (auth.userId) return auth.userId;

  // ✅ 2. JWT se userId nikaalo (FINAL BACKUP)
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return decoded.id || decoded._id || null;
    } catch (err) {
      console.error("❌ Invalid socket token");
      return null;
    }
  }

  return null;
}


export default function chatHandler(io) {
  const userSockets = new Map();

  function addSocket(userId, socket) {
    if (!userSockets.has(userId)) userSockets.set(userId, new Set());
    userSockets.get(userId).add(socket);
  }

  function removeSocket(userId, socket) {
    const set = userSockets.get(userId);
    if (!set) return;
    set.delete(socket);
    if (!set.size) userSockets.delete(userId);
  }

  function emitToUser(userId, event, payload) {
    const set = userSockets.get(userId?.toString());
    if (!set) return;
    for (const s of set) s.emit(event, payload);
  }

 io.on("connection", (socket) => {
  console.log("🟡 RAW HANDSHAKE:", socket.handshake.auth);

  const userId = getUserIdFromSocket(socket);

  console.log("🟢 CHAT USER ID:", userId);

  if (!userId) {
    console.error("❌ CHAT SOCKET BLOCKED DUE TO MISSING USER ID");
    return;
  }

  const uidStr = userId.toString();
  addSocket(uidStr, socket);


    socket.on("chat:send", async (payload, cb) => {
      try {
        const { toUserId, text } = payload || {};
        if (!toUserId || !text?.trim()) return;

        const msg = await ChatMessage.create({
          from: uidStr,
          to: toUserId,
          text: text.trim(),
          participants: [uidStr, toUserId],
        });

        const msgData = {
          _id: msg._id,
          from: msg.from,
          to: msg.to,
          text: msg.text,
          createdAt: msg.createdAt,
          expiresAt: msg.expiresAt,
        };

        socket.emit("chat:new_message", msgData);
        emitToUser(toUserId, "chat:new_message", msgData);

         // ⭐ GET SENDER INFO
    const sender = await User.findById(uidStr).select("username avatar");
        emitToUser(toUserId, "chat:notify", {
  textPreview: msg.text.slice(0, 80),
  from: {
    username: sender.username,
    _id: sender._id,
    avatar: sender.avatar
  },
  createdAt: msg.createdAt,
});


        if (cb) cb({ ok: true });
      } catch (err) {
        console.error("chat:send error", err);
        if (cb) cb({ ok: false });
      }
    });

    socket.on("chat:typing", ({ toUserId, isTyping }) => {
      emitToUser(toUserId, "chat:typing", {
        fromUserId: uidStr,
        isTyping: !!isTyping,
      });
    });

    socket.on("disconnect", () => removeSocket(uidStr, socket));
  });
}
