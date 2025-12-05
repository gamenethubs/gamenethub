import UserGameStats from "../models/UserGameStats.js";
import Game from "../models/Game.js";
import User from "../models/User.js";

const W = {
  playTime: 0.5,
  sessions: 20,
  opens: 10,
  favoriteBoost: 200,
  ratingBoostStar: 40,
};

export const getRecommendations = async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId).lean();
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    const stats = await UserGameStats.find({ user: userId }).populate("game");

    const genreScore = {};

    // Gameplay data
    stats.forEach((s) => {
      if (!s.game) return;
      const g = s.game.genre;

      const score =
        s.totalPlayTime * W.playTime +
        s.sessionCount * W.sessions +
        s.openCount * W.opens;

      genreScore[g] = (genreScore[g] || 0) + score;
    });

    // Favorites boost
    if (user.favorites?.length) {
      const favGames = await Game.find({ _id: { $in: user.favorites } });
      favGames.forEach((g) => {
        genreScore[g.genre] = (genreScore[g.genre] || 0) + W.favoriteBoost;
      });
    }

    // Ratings boost
    for (const r of user.ratedGames) {
      const g = await Game.findById(r.game);
      if (!g) continue;
      genreScore[g.genre] =
        (genreScore[g.genre] || 0) + r.stars * W.ratingBoostStar;
    }

    // Fallback for new users
    if (Object.keys(genreScore).length === 0) {
      const fallback = await Game.find({})
        .sort({ popularScore: -1 })
        .limit(12);
      return res.json({ success: true, recommendations: fallback });
    }

    const sortedGenres = Object.entries(genreScore)
      .sort((a, b) => b[1] - a[1])
      .map(([g]) => g);

    const playedIds = stats.map((s) => s.game._id);

    const recs = await Game.find({
      genre: { $in: sortedGenres.slice(0, 2) },
      _id: { $nin: playedIds },
    })
      .sort({ trendingScore: -1, popularScore: -1 })
      .limit(15);

    return res.json({ success: true, recommendations: recs });
  } catch (err) {
    console.error("RECOMMENDATION ERROR:", err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to load recommendations" });
  }
};
