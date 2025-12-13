// backend/socket/games/dotsAndBoxes.js

export default function dotsAndBoxes(socket, io) {

  socket.on("createRoom", () => {
    const roomId = Math.random().toString(36).substring(2, 8);
    socket.join(roomId);
    socket.emit("roomCreated", roomId);
    console.log("🆕 Dots & Boxes Room Created:", roomId);
  });

  socket.on("joinRoom", (roomId) => {
    const ns = io.of("/dots-and-boxes");
    const room = ns.adapter.rooms.get(roomId);

    if (!room) {
      socket.emit("roomError", "Room not found ❌");
      return;
    }

    socket.join(roomId);
    ns.to(roomId).emit("playerJoined", roomId);
    console.log("👤 Player joined Dots & Boxes room:", roomId);
  });

  // ⭐ SUPPORT BOTH INTENT + FULL STATE
  socket.on("playerMove", (data) => {

    // CLIENT → intent (dot)
    if (data.dot) {
      socket.to(data.roomId).emit("syncMove", {
        dot: data.dot
      });
      return;
    }

    // HOST → full state
    socket.to(data.roomId).emit("syncMove", {
      hLines: data.hLines,
      vLines: data.vLines,
      boxes: data.boxes,
      currentPlayer: data.currentPlayer,
    });
  });

  socket.on("restartGame", (roomId) => {
    io.of("/dots-and-boxes").to(roomId).emit("restartGame");
  });

  socket.on("disconnect", () => {
    console.log("❌ Dots & Boxes player disconnected:", socket.id);
  });
}
