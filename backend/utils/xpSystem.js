// utils/xpSystem.js
import User from "../models/User.js";

// XP required per level (simple formula)
function getXPRequired(level) {
  return 100 + (level - 1) * 50; // Level 1→2 = 100 XP, Level 2→3 = 150 XP...
}
 
// Give XP safely
export async function giveXP(userId, amount) {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    user.xp += amount;

    // Level up loop
    while (user.xp >= getXPRequired(user.level)) {
      user.xp -= getXPRequired(user.level);
      user.level += 1;
      console.log(`🎉 User ${user.name} leveled up → Level ${user.level}`);
    }

    await user.save();
    return true;
  } catch (err) {
    console.error("XP ERROR:", err);
    return false;
  }
}

// Track playtime from events
export async function addPlayTime(userId, minutes) {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    user.totalPlayTime += minutes;
    await user.save();
  } catch (err) {
    console.error("PLAYTIME ERROR:", err);
  }
}
