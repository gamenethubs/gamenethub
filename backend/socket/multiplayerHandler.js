// backend/socket/multiplayerHandler.js

import tictactoe from "./games/tictactoe.js";
import dotsAndBoxes from "./games/dotsAndBoxes.js";

export default function multiplayerHandler(io) {
  
  // Namespace for TicTacToe
  io.of("/tictactoe").on("connection", (socket) => {
    console.log("🎮 New TicTacToe connection:", socket.id);
    tictactoe(socket, io);
  });

  // Namespace for Dots & Boxes
  io.of("/dots-and-boxes").on("connection", (socket) => {
    console.log("🎲 New Dots & Boxes connection:", socket.id);
    dotsAndBoxes(socket, io);
  });

  // ⚠️ Future games can be added like this:
  // io.of("/ludo").on("connection", (socket) => {
  //   ludo(socket, io);
  // });
}
