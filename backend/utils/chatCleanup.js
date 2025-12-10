import ChatMessage from "../models/ChatMessage.js";

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export async function cleanupOldMessages() {
  const cutoff = new Date(Date.now() - ONE_DAY_MS);

  try {
    const res = await ChatMessage.deleteMany({
      createdAt: { $lt: cutoff },
    });

    if (res?.deletedCount)
      console.log(`Chat cleanup: deleted ${res.deletedCount} messages`);
  } catch (err) {
    console.error("Chat cleanup error:", err);
  }
}
