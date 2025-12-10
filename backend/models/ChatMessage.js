// backend/models/ChatMessage.js
import mongoose from "mongoose";
const { Schema } = mongoose;

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

const chatMessageSchema = new Schema(
  {
    from: { type: Schema.Types.ObjectId, ref: "User", required: true },
    to: { type: Schema.Types.ObjectId, ref: "User", required: true },
    participants: {
      type: [Schema.Types.ObjectId],
      ref: "User",
      index: true,
      validate: (arr) => arr.length === 2,
    },
    text: { type: String, required: true, trim: true, maxlength: 2000 },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 },
    },
  },
  { timestamps: true }
);

chatMessageSchema.pre("validate", function (next) {
  if (!this.expiresAt) {
    const base = this.createdAt || new Date();
    this.expiresAt = new Date(base.getTime() + ONE_DAY_MS);
  }
  next();
});

export default mongoose.model("ChatMessage", chatMessageSchema);
