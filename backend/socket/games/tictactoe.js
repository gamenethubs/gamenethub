// backend/socket/games/tictactoe.js

export default function tictactoe(socket, io) {

  // Create room
  socket.on("createRoom", () => {
    const roomId = Math.random().toString(36).substring(2, 8);
    socket.join(roomId);

    socket.emit("roomCreated", roomId);
    console.log("🆕 Room Created:", roomId);
  });

  // Join room
  socket.on("joinRoom", (roomId) => {
    const ns = io.of("/tictactoe");
    const room = ns.adapter.rooms.get(roomId);

    if (!room) {
      socket.emit("roomError", "Room not found ❌");
      return;
    }

    socket.join(roomId);

    // Notify both players
    ns.to(roomId).emit("playerJoined", roomId);
    console.log("👤 Player joined room:", roomId);
  });

  // Player move
  socket.on("playerMove", (data) => {
    const ns = io.of("/tictactoe");
    socket.to(data.roomId).emit("updateMove", data);
  });

  // Restart game sync
  socket.on("restartGame", (roomId) => {
    const ns = io.of("/tictactoe");
    ns.to(roomId).emit("restartGame");
  });

  // Disconnect logs
  socket.on("disconnect", () => {
    console.log("❌ Player disconnected:", socket.id);
  });
}
