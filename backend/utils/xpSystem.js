// utils/xpSystem.js
import User from "../models/User.js";
import { checkAndAwardBadges, BADGE_RULES } from "./badgeSystem.js";

/**************************************
 * ⭐ XP REQUIRED PER LEVEL
 **************************************/
export function getXPRequired(level) {
  return 100 + (level - 1) * 50;
}

/**************************************
 * ⭐ GIVE XP (LEVEL SYSTEM + BADGES)
 **************************************/
export async function giveXP(userId, amount) {
  try {
    const user = await User.findById(userId);
    if (!user) return false;

    user.xp += amount;

    // Level Up Logic
    while (user.xp >= getXPRequired(user.level)) {
      const req = getXPRequired(user.level);
      user.xp -= req;
      user.level += 1;
    }

    await user.save();
    await checkAndAwardBadges(user._id);
    return true;

  } catch (err) {
    console.error("XP ERROR:", err);
    return false;
  }
}

/**************************************
 * ⭐ ADD PLAYTIME & CHECK BADGES
 **************************************/
export async function addPlayTime(userId, minutes) {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    user.totalPlayTime += minutes;

    await user.save();
    await checkAndAwardBadges(user._id);

  } catch (err) {
    console.error("PLAYTIME ERROR:", err);
  }
}

/**************************************
 * ⭐ CALCULATE BADGE PROGRESS
 **************************************/
function calculateBadgeProgress(user) {
  return BADGE_RULES.map(rule => {
    let current = 0;
    let required = 0;

    switch (rule.id) {
      case "level_5":
        current = user.level;
        required = 5;
        break;

      case "level_10":
        current = user.level;
        required = 10;
        break;

      case "xp_500":
        current = user.xp;
        required = 500;
        break;

      case "playtime_1000":
        current = user.totalPlayTime;
        required = 1000;
        break;
    }

    const percent = Math.min(100, (current / required) * 100);

    return {
      id: rule.id,
      name: rule.name,
      description: rule.description,
      current,
      required,
      progress: Math.round(percent),
      unlocked: user.badges.some(b => b.name === rule.name),
    };
  });
}

/**************************************
 * ⭐ FETCH XP + BADGES + PROGRESS
 **************************************/
export async function getUserXPStats(userId) {
  try {
    const user = await User.findById(userId)
      .select("xp level totalPlayTime weeklyStreak badges");

    if (!user) return null;

    const xpNeeded = getXPRequired(user.level);
    const progress = (user.xp / xpNeeded) * 100;

    const badgeProgress = calculateBadgeProgress(user);

    return {
      xp: user.xp,
      level: user.level,
      xpNeeded,
      progress,

      // NEW FIELDS
      weeklyStreak: user.weeklyStreak,
      totalPlayTime: user.totalPlayTime,
      badges: user.badges,
      badgeProgress,
    };

  } catch (err) {
    console.error("XP FETCH ERROR:", err);
    return null;
  }
}
