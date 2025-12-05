/*******************************************************
 * backend/socket/presenceHandler.js
 * Handles realtime Online / Offline user presence
 *******************************************************/
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Mapping: userId → Set of socketIds
const userSockets = new Map();

export default function presenceHandler(io) {
  io.on("connection", async (socket) => {

    /****************************************************
     * 1️⃣ Verify Token
     ****************************************************/
    const token = socket.handshake.auth?.token;

    if (!token) {
      console.log("❌ No token → disconnect");
      return socket.disconnect();
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      console.log("❌ Invalid JWT for socket:", err.message);
      return socket.disconnect();
    }

    const userId = decoded.id;
    socket.userId = userId;

    /****************************************************
     * 2️⃣ Track user socket
     ****************************************************/
    if (!userSockets.has(userId)) {
      userSockets.set(userId, new Set());
    }
    userSockets.get(userId).add(socket.id);

    /****************************************************
     * 3️⃣ Mark user ONLINE
     ****************************************************/
    await User.findByIdAndUpdate(userId, {
      $set: { lastSeen: new Date() },
    });

    /****************************************************
     * 4️⃣ Notify friends → "online"
     ****************************************************/
    const user = await User.findById(userId).select("friends");

    if (user?.friends) {
      user.friends.forEach((fId) => {
        io.to(fId.toString()).emit("friend_online", { userId });
      });
    }

    /****************************************************
     * 5️⃣ Join personal room
     ****************************************************/
    socket.join(userId.toString());

    console.log(`🔵 Online: ${userId}, socket ${socket.id}`);

    /****************************************************
     * 6️⃣ On DISCONNECT
     ****************************************************/
    socket.on("disconnect", async () => {
      console.log(`🔻 Disconnect: ${socket.id}`);

      const sockets = userSockets.get(userId);
      if (!sockets) return;

      sockets.delete(socket.id);

      // If user has NO active sockets → user is offline
      if (sockets.size === 0) {
        userSockets.delete(userId);

        /****************************************************
         * Update lastSeen & notify friends
         ****************************************************/
        await User.findByIdAndUpdate(userId, {
          $set: { lastSeen: new Date() },
        });

        const u = await User.findById(userId).select("friends");
        if (u?.friends) {
          u.friends.forEach((fId) =>
            io.to(fId.toString()).emit("friend_offline", { userId })
          );
        }

        console.log(`⚪ Offline: ${userId}`);
      }
    });
  });
}
