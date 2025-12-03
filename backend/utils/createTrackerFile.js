// backend/utils/createTrackerFile.js
import fs from "fs";
import path from "path";

const createTrackerFile = () => {
  try {
    const gameRoot = process.env.GAME_PATH; 
    // e.g., /var/data/uploads/games

    if (!gameRoot) {
      console.error("❌ GAME_PATH is missing. Cannot create tracker.js");
      return;
    }

    // Folder: /var/data/uploads/games/common
    const commonDir = path.join(gameRoot, "common");
    const trackerPath = path.join(commonDir, "tracker.js");

    // Ensure common folder exists
    if (!fs.existsSync(commonDir)) {
      fs.mkdirSync(commonDir, { recursive: true });
      console.log("📁 Created folder:", commonDir);
    }

    // Tracker.js global function
    const trackerCode = `
      // Global tracking function for all HTML games
      window.sendEvent = function (data) {
        try {
          if (!data || typeof data !== "object") return;

          fetch("/api/game/event", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          })
          .catch((err) => {
            console.warn("Tracking error:", err);
          });
        } catch (e) {
          console.warn("Tracking exception:", e);
        }
      };
    `;

    // Write or overwrite tracker.js
    fs.writeFileSync(trackerPath, trackerCode, "utf8");
    console.log("🟢 tracker.js created at:", trackerPath);

  } catch (err) {
    console.error("❌ ERROR writing tracker.js:", err);
  }
};

export default createTrackerFile;
