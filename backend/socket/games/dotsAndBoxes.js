// backend/socket/games/dotsAndBoxes.js

export default function dotsAndBoxes(socket, io) {
  const ns = io.of("/dots-and-boxes");

  socket.on("createRoom", () => {
    const roomId = Math.random().toString(36).substring(2, 8);
    socket.join(roomId);
    
    // Host ko Room ID bhej rahe hain
    socket.emit("roomCreated", roomId);
    console.log("🆕 Dots & Boxes Room Created:", roomId);
  });

  socket.on("joinRoom", (roomId) => {
    const room = ns.adapter.rooms.get(roomId);

    if (!room) {
      socket.emit("roomError", "Room not found ❌");
      return;
    }

    // Check agar room pehle se full toh nahi
    if (room.size >= 2) {
      socket.emit("roomError", "Room is full 🚫");
      return;
    }

    socket.join(roomId);

    // ⭐ Sabse Important: Join karne wale ko uska role (Player 2) bhej rahe hain
    socket.emit("playerRole", 2);

    // Dono players ko batana ki game start ho sakti hai
    ns.to(roomId).emit("playerJoined", roomId);
    console.log("👤 Player 2 joined Dots & Boxes room:", roomId);
  });

  socket.on("playerMove", (data) => {
    // 1. Agar Client (P2) dot bhej raha hai -> Host (P1) ko forward karo
    if (data.dot) {
      socket.to(data.roomId).emit("syncMove", {
        dot: data.dot
      });
      return;
    }

    // 2. Agar Host (P1) full state bhej raha hai -> Client (P2) ko forward karo
    socket.to(data.roomId).emit("syncMove", {
      hLines: data.hLines,
      vLines: data.vLines,
      boxes: data.boxes,
      currentPlayer: data.currentPlayer,
      scores: data.scores,    // 👈 Ye add kiya
      gameOver: data.gameOver
    });
  });

  socket.on("restartGame", (roomId) => {
    ns.to(roomId).emit("restartGame");
  });

  socket.on("disconnect", () => {
    console.log("❌ Dots & Boxes player disconnected:", socket.id);
  });
}