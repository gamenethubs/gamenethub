import User from "../models/User.js";

// Badge definitions (simple)
export const BADGE_RULES = [
  {
    id: "level_5",
    name: "Rookie",
    description: "Reached Level 5",
    condition: (user) => user.level >= 5
  },
  {
    id: "level_10",
    name: "Pro Gamer",
    description: "Reached Level 10",
    condition: (user) => user.level >= 10
  },
  {
    id: "xp_500",
    name: "XP Hunter",
    description: "Earned 500 total XP",
    condition: (user) => user.totalPlayTime > 0 && user.xp >= 500
  },
  {
    id: "playtime_1000",
    name: "Marathoner",
    description: "Played 1000 minutes total",
    condition: (user) => user.totalPlayTime >= 1000
  }
];

export async function checkAndAwardBadges(userId) {
  const user = await User.findById(userId);
  if (!user) return;

  const unlocked = user.badges?.map((b) => b.name) || [];

  for (const rule of BADGE_RULES) {
    if (!unlocked.includes(rule.name) && rule.condition(user)) {
      // unlock badge
      user.badges.push({
        name: rule.name,
        description: rule.description,
        icon: `/badges/${rule.id}.png`,
        unlockedAt: new Date(),
      });

      console.log(`🏅 Badge unlocked: ${rule.name} for user ${user.name}`);
    }
  }

  await user.save();
}
