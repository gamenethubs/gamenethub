// utils/xpSystem.js
import User from "../models/User.js";

/**************************************
 * ⭐ XP REQUIRED PER LEVEL
 **************************************/
export function getXPRequired(level) {
  return 100 + (level - 1) * 50;
}

/**************************************
 * ⭐ GIVE XP (LEVEL SYSTEM INSIDE)
 **************************************/
export async function giveXP(userId, amount) {
  try {
    const user = await User.findById(userId);
    if (!user) return false;

    user.xp += amount;

    // Check level ups
    while (user.xp >= getXPRequired(user.level)) {
      const req = getXPRequired(user.level);
      user.xp -= req;
      user.level += 1;
    }

    await user.save();
    return true;

  } catch (err) {
    console.error("XP ERROR:", err);
    return false;
  }
}

/**************************************
 * ⭐ ADD PLAYTIME (TRACK TOTAL MINUTES)
 **************************************/
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

/**************************************
 * ⭐ FETCH XP + LEVEL FOR FRONTEND
 **************************************/
export async function getUserXPStats(userId) {
  try {
    const user = await User.findById(userId).select("xp level");

    if (!user) return null;

    const xpNeeded = getXPRequired(user.level);
    const progress = (user.xp / xpNeeded) * 100;

    return {
      xp: user.xp,
      level: user.level,
      xpNeeded,
      progress,
    };

  } catch (err) {
    console.error("XP FETCH ERROR:", err);
    return null;
  }
}
