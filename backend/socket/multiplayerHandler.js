// backend/socket/multiplayerHandler.js

import tictactoe from "./games/tictactoe.js";

export default function multiplayerHandler(io) {
  
  // Namespace for TicTacToe
  io.of("/tictactoe").on("connection", (socket) => {
    console.log("🎮 New TicTacToe connection:", socket.id);
    tictactoe(socket, io);
  });

  // ⚠️ Future games can be added like this:
  // io.of("/ludo").on("connection", (socket) => {
  //   ludo(socket, io);
  // });

}
