// backend/models/GameEvent.js
import mongoose from "mongoose";

const gameEventSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    game: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Game",
      required: true,
    },

    eventType: {
      type: String,
      enum: [
        "game_start",
        "game_end",
        "level_start",
        "level_complete",
        "level_fail"
      ],
      required: true,
    },

    level: {
      type: Number,
      default: null,
    },

    metadata: {
      type: Object,
      default: {},
    },

    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: false }
);

export default mongoose.model("GameEvent", gameEventSchema);
