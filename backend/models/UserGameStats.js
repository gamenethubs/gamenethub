// backend/models/UserGameStats.js
import mongoose from "mongoose";

const userGameStatsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
 
    game: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Game",
      required: true,
      index: true,
    },

    totalPlayTime: { type: Number, default: 0 },   // in seconds
    openCount: { type: Number, default: 0 },
    sessionCount: { type: Number, default: 0 },

    lastSessionStart: { type: Date, default: null }, // private temp
    lastPlayed: { type: Date, default: null },
  },
  { timestamps: true }
);

// prevent duplicates
userGameStatsSchema.index({ user: 1, game: 1 }, { unique: true });

export default mongoose.model("UserGameStats", userGameStatsSchema); 

