// backend/socket/games/dotsAndBoxes.js

export default function dotsAndBoxes(socket, io) {

  // Create room
  socket.on("createRoom", () => {
    const roomId = Math.random().toString(36).substring(2, 8);
    socket.join(roomId);

    socket.emit("roomCreated", roomId);
    console.log("🆕 Dots & Boxes Room Created:", roomId);
  });

  // Join room
  socket.on("joinRoom", (roomId) => {
    const ns = io.of("/dots-and-boxes");
    const room = ns.adapter.rooms.get(roomId);

    if (!room) {
      socket.emit("roomError", "Room not found ❌");
      return;
    }

    socket.join(roomId);

    // Notify both players
    ns.to(roomId).emit("playerJoined", roomId);
    console.log("👤 Player joined Dots & Boxes room:", roomId);
  });

  // ✅ FULL STATE SYNC (frontend-compatible)
  socket.on("playerMove", (data) => {
    const ns = io.of("/dots-and-boxes");

    // send move to other player only
    socket.to(data.roomId).emit("syncMove", {
      hLines: data.hLines,
      vLines: data.vLines,
      boxes: data.boxes,
      currentPlayer: data.currentPlayer,
    });
  });

  // Restart game sync (optional)
  socket.on("restartGame", (roomId) => {
    const ns = io.of("/dots-and-boxes");
    ns.to(roomId).emit("restartGame");
  });

  socket.on("disconnect", () => {
    console.log("❌ Dots & Boxes player disconnected:", socket.id);
  });
}
