/*******************************************************
 * backend/socket/presenceHandler.js (PERFECTED VERSION)
 *******************************************************/
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const userSockets = new Map(); // userId → Set(socketIds)

export default function presenceHandler(io) {
  io.on("connection", async (socket) => {

    /***********************
     * 1) AUTH CHECK
     ***********************/
    const token = socket.handshake.auth?.token;
    if (!token) return socket.disconnect();

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return socket.disconnect();
    }

    const userId = decoded.id;
    socket.userId = userId;

    /***********************
     * 2) REGISTER SOCKET
     ***********************/
    if (!userSockets.has(userId)) userSockets.set(userId, new Set());
    const socketSet = userSockets.get(userId);
    socketSet.add(socket.id);

    /***********************
     * 3) MARK ONLINE only if first socket
     ***********************/
    if (socketSet.size === 1) {
      await User.findByIdAndUpdate(userId, { lastSeen: new Date() });

      const user = await User.findById(userId).select("friends");
      user?.friends?.forEach((fid) =>
        io.to(fid.toString()).emit("friend_online", { userId })
      );

      console.log(`🔵 ONLINE: ${userId}`);
    }

    /***********************
     * 4) JOIN PERSONAL ROOM
     ***********************/
    socket.join(userId.toString());

    /***********************
     * 5) HEARTBEAT HANDLER
     ***********************/
    socket.on("heartbeat", async () => {
      await User.findByIdAndUpdate(userId, { lastSeen: new Date() });
    });

    /***********************
     * 6) DISCONNECT HANDLER
     ***********************/
    socket.on("disconnect", () => {
      setTimeout(async () => {
        const sockets = userSockets.get(userId);
        if (!sockets) return;

        sockets.delete(socket.id);

        // If user has ZERO sockets left → mark offline
        if (sockets.size === 0) {
          userSockets.delete(userId);

          await User.findByIdAndUpdate(userId, { lastSeen: new Date() });

          const user = await User.findById(userId).select("friends");
          user?.friends?.forEach((fid) =>
            io.to(fid.toString()).emit("friend_offline", { userId })
          );

          console.log(`⚪ OFFLINE: ${userId}`);
        }
      }, 1500); // small delay prevents flicker on page refresh
    });
  });
}
