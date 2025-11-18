// // backend/controllers/gameController.js
// import Game from "../models/Game.js";
// import User from "../models/User.js";
// import extract from "extract-zip";
// import fs from "fs";
// import path from "path";
// import slugify from "slugify";

// /*******************************************
//  * SCORE CALCULATIONS
//  *******************************************/
// const calculateTrendingScore = (game) => {
//   const days =
//     (Date.now() - new Date(game.createdAt).getTime()) /
//     (1000 * 60 * 60 * 24);

//   return (
//     game.averageRating * 20 +
//     game.playCount * 2 +
//     Math.max(0, 50 - days)
//   );
// };

// const calculatePopularScore = (game) => {
//   return game.playCount * 3 + game.averageRating * 10;
// };

// /*******************************************
//  * GET ALL GAMES
//  *******************************************/
// export const getAllGames = async (req, res) => {
//   try {
//     let games = await Game.find()
//       .sort({ createdAt: -1 })
//       .populate("ratings.user", "_id name email");

//     const finalGames = games.map((g) => ({
//       ...g._doc,
//       trendingScore: calculateTrendingScore(g),
//       popularScore: calculatePopularScore(g),
//     }));

//     return res.json({ success: true, games: finalGames });
//   } catch (err) {
//     return res
//       .status(500)
//       .json({ success: false, message: "Failed to fetch games" });
//   }
// };

// /*******************************************
//  * GET GAME BY ID
//  *******************************************/
// export const getGameById = async (req, res) => {
//   try {
//     const g = await Game.findById(req.params.id).populate(
//       "ratings.user",
//       "_id name email"
//     );

//     if (!g) return res.status(404).json({ message: "Game not found" });

//     return res.json({
//       success: true,
//       game: {
//         ...g._doc,
//         trendingScore: calculateTrendingScore(g),
//         popularScore: calculatePopularScore(g),
//       },
//     });
//   } catch {
//     return res.status(500).json({ message: "Error fetching game" });
//   }
// };

// /*******************************************
//  * GET GAME BY SLUG
//  *******************************************/
// export const getGameBySlug = async (req, res) => {
//   try {
//     const g = await Game.findOne({ slug: req.params.slug }).populate(
//       "ratings.user",
//       "_id name email"
//     );

//     if (!g) return res.status(404).json({ message: "Game not found" });

//     return res.json({
//       success: true,
//       game: {
//         ...g._doc,
//         trendingScore: calculateTrendingScore(g),
//         popularScore: calculatePopularScore(g),
//       },
//     });
//   } catch {
//     return res
//       .status(500)
//       .json({ message: "Error fetching game by slug" });
//   }
// };

// /*******************************************
//  * CREATE GAME — FIXED AND COMPLETE
//  *******************************************/
// export const createGame = async (req, res) => {
//   try {
//     const { title, genre, description } = req.body;

//     if (!req.files?.thumbnail || !req.files?.gameZip) {
//       return res
//         .status(400)
//         .json({ message: "Thumbnail & ZIP required" });
//     }

//     const slug = slugify(title, { lower: true, strict: true });

//     const thumbnailFile = req.files.thumbnail[0];
//     const zipFile = req.files.gameZip[0];

//     const thumbnailURL = `/uploads/thumbnails/${thumbnailFile.filename}`;
//     const zipURL = `/uploads/gameZips/${zipFile.filename}`; // ⭐ SAVE ZIP PATH

//     const extractDir = path.join("public", "games", slug);

//     if (fs.existsSync(extractDir)) {
//       fs.rmSync(extractDir, { recursive: true });
//     }

//     fs.mkdirSync(extractDir, { recursive: true });

//     try {
//       await extract(zipFile.path, { dir: path.resolve(extractDir) });
//     } catch (err) {
//       return res.status(400).json({ message: "Invalid ZIP file" });
//     }

//     let indexPath = "";
//     const scan = (dir) => {
//       const items = fs.readdirSync(dir);
//       for (let item of items) {
//         const full = path.join(dir, item);
//         if (fs.statSync(full).isDirectory()) scan(full);
//         else if (item.toLowerCase() === "index.html") indexPath = full;
//       }
//     };
//     scan(extractDir);

//     if (!indexPath) {
//       return res.status(400).json({ message: "index.html NOT found" });
//     }

//     const playUrl = indexPath.replace("public", "").replace(/\\/g, "/");

//     const game = await Game.create({
//       title,
//       slug,
//       genre,
//       description,
//       thumbnail: thumbnailURL,
//       gameZip: zipURL, // ⭐ STORE ZIP IN DB
//       playUrl,
//       averageRating: 4.0,
//       totalRatings: 0,
//       ratings: [],
//       playedIPs: [],
//       playCount: 0,
//     });

//     return res.json({
//       success: true,
//       message: "Game uploaded",
//       game: {
//         ...game._doc,
//         trendingScore: calculateTrendingScore(game),
//         popularScore: calculatePopularScore(game),
//       },
//     });
//   } catch (err) {
//     return res.status(500).json({ message: "Failed to upload game" });
//   }
// };

// /*******************************************
//  * UPDATE GAME — ZIP + IMAGE FULLY FIXED
//  *******************************************/
// export const updateGame = async (req, res) => {
//   try {
//     const game = await Game.findById(req.params.id);
//     if (!game) return res.status(404).json({ message: "Game not found" });

//     const { title, genre, description, rating } = req.body;

//     const newSlug = slugify(title, { lower: true, strict: true });

//     let thumbnailURL = game.thumbnail;
//     let zipURL = game.gameZip;
//     let playUrl = game.playUrl;

//     /************ THUMBNAIL UPDATE ************/
//     if (req.files?.thumbnail?.[0]) {
//       const file = req.files.thumbnail[0];
//       thumbnailURL = `/uploads/thumbnails/${file.filename}`;
//     }

//     /************ ZIP UPDATE ************/
//     if (req.files?.gameZip?.[0]) {
//       const zipFile = req.files.gameZip[0];

//       zipURL = `/uploads/gameZips/${zipFile.filename}`;

//       const extractDir = path.join("public", "games", newSlug);

//       if (fs.existsSync(extractDir)) {
//         fs.rmSync(extractDir, { recursive: true });
//       }

//       fs.mkdirSync(extractDir, { recursive: true });

//       try {
//         await extract(zipFile.path, { dir: path.resolve(extractDir) });
//       } catch {
//         return res.status(400).json({ message: "Invalid ZIP file" });
//       }

//       let indexPath = "";
//       const scan = (dir) => {
//         const items = fs.readdirSync(dir);
//         for (let item of items) {
//           const full = path.join(dir, item);
//           if (fs.statSync(full).isDirectory()) scan(full);
//           else if (item.toLowerCase() === "index.html") indexPath = full;
//         }
//       };
//       scan(extractDir);

//       if (!indexPath) {
//         return res.status(400).json({ message: "index.html NOT found" });
//       }

//       playUrl = indexPath.replace("public", "").replace(/\\/g, "/");
//     }

//     /************ UPDATE DB ************/
//     game.title = title;
//     game.slug = newSlug;
//     game.genre = genre;
//     game.description = description;
//     game.rating = rating;
//     game.thumbnail = thumbnailURL;
//     game.gameZip = zipURL; // ⭐ UPDATE ZIP
//     game.playUrl = playUrl;

//     await game.save();

//     return res.json({
//       success: true,
//       message: "Game updated successfully",
//       game: {
//         ...game._doc,
//         trendingScore: calculateTrendingScore(game),
//         popularScore: calculatePopularScore(game),
//       },
//     });
//   } catch (err) {
//     console.log("UPDATE GAME ERROR:", err);
//     return res.status(500).json({ message: "Failed to update game" });
//   }
// };

// /*******************************************
//  * DELETE GAME
//  *******************************************/
// export const deleteGame = async (req, res) => {
//   try {
//     const g = await Game.findByIdAndDelete(req.params.id);
//     if (!g) return res.status(404).json({ message: "Game not found" });

//     const folder = path.join("public/games", g.slug);
//     if (fs.existsSync(folder)) fs.rmSync(folder, { recursive: true });

//     return res.json({ success: true, message: "Game deleted" });
//   } catch {
//     return res.status(500).json({ message: "Failed to delete game" });
//   }
// };

// /*******************************************
//  * INCREASE PLAY COUNT
//  *******************************************/
// export const increasePlayCount = async (req, res) => {
//   try {
//     const game = await Game.findById(req.params.id);
//     if (!game)
//       return res.status(404).json({ message: "Game not found" });

//     game.playCount += 1;
//     await game.save();

//     return res.json({
//       success: true,
//       playCount: game.playCount,
//     });
//   } catch (err) {
//     console.log("PLAYCOUNT ERROR:", err);
//     return res.status(500).json({ message: "Failed to increase play" });
//   }
// };

// /*******************************************
//  * USER RATING SYSTEM
//  *******************************************/
// export const rateGame = async (req, res) => {
//   try {
//     if (!req.user) {
//       return res.status(401).json({ message: "Login required" });
//     }

//     const userId = req.user._id.toString();
//     const { stars } = req.body;

//     if (!stars || stars < 1 || stars > 5) {
//       return res.status(400).json({ message: "Stars must be 1–5" });
//     }

//     const game = await Game.findById(req.params.id);
//     if (!game) return res.status(404).json({ message: "Game not found" });

//     const existing = game.ratings.find((r) => {
//       const rUser = r.user?._id?.toString() ?? r.user?.toString();
//       return rUser === userId;
//     });

//     if (existing) existing.stars = stars;
//     else game.ratings.push({ user: userId, stars });

//     const user = await User.findById(userId);

//     const uRated = user.ratedGames.find(
//       (r) => r.game.toString() === game._id.toString()
//     );

//     if (uRated) uRated.stars = stars;
//     else user.ratedGames.push({ game: game._id, stars });

//     const total = game.ratings.length;
//     const sum = game.ratings.reduce((a, r) => a + r.stars, 0);

//     game.totalRatings = total;
//     game.averageRating = Number((sum / total).toFixed(2));

//     await user.save();
//     await game.save();

//     return res.json({
//       success: true,
//       rating: game.averageRating,
//       totalRatings: game.totalRatings,
//       userRating: stars,
//     });
//   } catch (err) {
//     console.log("RATE GAME ERROR:", err);
//     return res.status(500).json({ message: "Failed to rate game" });
//   }
// };


// backend/controllers/gameController.js
import Game from "../models/Game.js";
import User from "../models/User.js";
import extract from "extract-zip";
import fs from "fs";
import path from "path";
import slugify from "slugify";

const ROOT_DIR = process.cwd();

// Persistent Disk Paths
const UPLOADS_ROOT = path.join(ROOT_DIR, "uploads");
const GAME_EXTRACT_ROOT = path.join(UPLOADS_ROOT, "games");

// Ensure folders exist
if (!fs.existsSync(UPLOADS_ROOT)) fs.mkdirSync(UPLOADS_ROOT);
if (!fs.existsSync(GAME_EXTRACT_ROOT)) fs.mkdirSync(GAME_EXTRACT_ROOT);

/*******************************************
 * SCORE CALCULATIONS
 *******************************************/
const calculateTrendingScore = (game) => {
  const days =
    (Date.now() - new Date(game.createdAt).getTime()) /
    (1000 * 60 * 60 * 24);

  return (
    game.averageRating * 20 +
    game.playCount * 2 +
    Math.max(0, 50 - days)
  );
};

const calculatePopularScore = (game) => {
  return game.playCount * 3 + game.averageRating * 10;
};

/*******************************************
 * GET ALL GAMES
 *******************************************/
export const getAllGames = async (req, res) => {
  try {
    const games = await Game.find()
      .sort({ createdAt: -1 })
      .populate("ratings.user", "_id name email")
      .lean();

    const finalGames = games.map((g) => ({
      ...g,
      trendingScore: calculateTrendingScore(g),
      popularScore: calculatePopularScore(g),
    }));

    return res.json({ success: true, games: finalGames });
  } catch (err) {
    console.error("FETCH ALL GAMES ERROR:", err);
    return res.status(500).json({ message: "Failed to fetch games" });
  }
};

/*******************************************
 * GET GAME BY ID
 *******************************************/
export const getGameById = async (req, res) => {
  try {
    const g = await Game.findById(req.params.id)
      .populate("ratings.user", "_id name email")
      .lean();

    if (!g) return res.status(404).json({ message: "Game not found" });

    return res.json({
      success: true,
      game: {
        ...g,
        trendingScore: calculateTrendingScore(g),
        popularScore: calculatePopularScore(g),
      },
    });
  } catch (err) {
    console.error("GET GAME BY ID ERROR:", err);
    return res.status(500).json({ message: "Error fetching game" });
  }
};

/*******************************************
 * GET GAME BY SLUG
 *******************************************/
export const getGameBySlug = async (req, res) => {
  try {
    const g = await Game.findOne({ slug: req.params.slug })
      .populate("ratings.user", "_id name email")
      .lean();

    if (!g) return res.status(404).json({ message: "Game not found" });

    return res.json({
      success: true,
      game: {
        ...g,
        trendingScore: calculateTrendingScore(g),
        popularScore: calculatePopularScore(g),
      },
    });
  } catch (err) {
    console.error("GET GAME BY SLUG ERROR:", err);
    return res.status(500).json({ message: "Error fetching game by slug" });
  }
};

/*******************************************
 * CREATE GAME — Fully Render / Persistent Disk Safe
 *******************************************/
export const createGame = async (req, res) => {
  try {
    const { title, genre, description } = req.body;

    if (!req.files?.thumbnail || !req.files?.gameZip) {
      return res.status(400).json({
        message: "Thumbnail & ZIP file required",
      });
    }

    const slug = slugify(title, { lower: true, strict: true });

    const thumbnailFile = req.files.thumbnail[0];
    const zipFile = req.files.gameZip[0];

    const thumbnailURL = `/uploads/thumbnails/${thumbnailFile.filename}`;
    const zipURL = `/uploads/zips/${zipFile.filename}`;

    const extractDir = path.join(GAME_EXTRACT_ROOT, slug);

    // Remove old folder
    if (fs.existsSync(extractDir)) fs.rmSync(extractDir, { recursive: true });
    fs.mkdirSync(extractDir, { recursive: true });

    // Extract ZIP file
    try {
      await extract(zipFile.path, { dir: extractDir });
    } catch (err) {
      console.error("ZIP EXTRACT ERROR:", err);
      return res.status(400).json({ message: "Invalid ZIP file" });
    }

    // Find index.html inside extracted folder
    let indexPath = "";
    const scan = (dir) => {
      for (const item of fs.readdirSync(dir)) {
        const full = path.join(dir, item);
        if (fs.statSync(full).isDirectory()) scan(full);
        else if (item.toLowerCase() === "index.html") indexPath = full;
      }
    };
    scan(extractDir);

    if (!indexPath) {
      return res.status(400).json({ message: "index.html NOT found in ZIP" });
    }

    const playUrl = indexPath.replace(ROOT_DIR, "").replace(/\\/g, "/");

    const game = await Game.create({
      title,
      slug,
      genre,
      description,
      thumbnail: thumbnailURL,
      gameZip: zipURL,
      playUrl,
      averageRating: 4.0,
      totalRatings: 0,
      ratings: [],
      playedIPs: [],
      playCount: 0,
    });

    return res.json({
      success: true,
      message: "Game uploaded successfully",
      game: {
        ...game._doc,
        trendingScore: calculateTrendingScore(game),
        popularScore: calculatePopularScore(game),
      },
    });
  } catch (err) {
    console.error("UPLOAD GAME ERROR:", err);
    return res.status(500).json({ message: "Failed to upload game" });
  }
};

/*******************************************
 * UPDATE GAME
 *******************************************/
export const updateGame = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ message: "Game not found" });

    const { title, genre, description } = req.body;
    const newSlug = slugify(title, { lower: true, strict: true });

    let thumbnailURL = game.thumbnail;
    let zipURL = game.gameZip;
    let playUrl = game.playUrl;

    // Thumbnail update
    if (req.files?.thumbnail?.[0]) {
      thumbnailURL = `/uploads/thumbnails/${req.files.thumbnail[0].filename}`;
    }

    // ZIP update
    if (req.files?.gameZip?.[0]) {
      const zipFile = req.files.gameZip[0];
      zipURL = `/uploads/zips/${zipFile.filename}`;

      const extractDir = path.join(GAME_EXTRACT_ROOT, newSlug);

      if (fs.existsSync(extractDir)) fs.rmSync(extractDir, { recursive: true });
      fs.mkdirSync(extractDir, { recursive: true });

      try {
        await extract(zipFile.path, { dir: extractDir });
      } catch (err) {
        console.error("ZIP UPDATE ERROR:", err);
        return res.status(400).json({ message: "Invalid ZIP file" });
      }

      let indexPath = "";
      const scan = (dir) => {
        for (const item of fs.readdirSync(dir)) {
          const full = path.join(dir, item);
          if (fs.statSync(full).isDirectory()) scan(full);
          else if (item.toLowerCase() === "index.html") indexPath = full;
        }
      };
      scan(extractDir);

      if (!indexPath)
        return res.status(400).json({ message: "index.html not found" });

      playUrl = indexPath.replace(ROOT_DIR, "").replace(/\\/g, "/");
    }

    game.title = title;
    game.slug = newSlug;
    game.genre = genre;
    game.description = description;
    game.thumbnail = thumbnailURL;
    game.gameZip = zipURL;
    game.playUrl = playUrl;

    await game.save();

    return res.json({
      success: true,
      message: "Game updated successfully",
      game: {
        ...game._doc,
        trendingScore: calculateTrendingScore(game),
        popularScore: calculatePopularScore(game),
      },
    });
  } catch (err) {
    console.error("UPDATE GAME ERROR:", err);
    return res.status(500).json({ message: "Failed to update game" });
  }
};

/*******************************************
 * DELETE GAME
 *******************************************/
export const deleteGame = async (req, res) => {
  try {
    const g = await Game.findByIdAndDelete(req.params.id);
    if (!g) return res.status(404).json({ message: "Game not found" });

    const folder = path.join(GAME_EXTRACT_ROOT, g.slug);
    if (fs.existsSync(folder)) fs.rmSync(folder, { recursive: true });

    return res.json({
      success: true,
      message: "Game deleted successfully",
    });
  } catch (err) {
    console.error("DELETE GAME ERROR:", err);
    return res.status(500).json({ message: "Failed to delete game" });
  }
};

/*******************************************
 * INCREASE PLAY COUNT
 *******************************************/
export const increasePlayCount = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ message: "Game not found" });

    game.playCount += 1;
    await game.save();

    return res.json({
      success: true,
      playCount: game.playCount,
    });
  } catch (err) {
    console.error("PLAY COUNT ERROR:", err);
    return res.status(500).json({ message: "Failed to increase play" });
  }
};

/*******************************************
 * USER RATING SYSTEM
 *******************************************/
export const rateGame = async (req, res) => {
  try {
    const userId = req.user?._id?.toString();
    if (!userId) {
      return res.status(401).json({ message: "Login required" });
    }

    const { stars } = req.body;
    if (!stars || stars < 1 || stars > 5) {
      return res.status(400).json({ message: "Stars must be 1–5" });
    }

    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ message: "Game not found" });

    // Update rating
    const existing = game.ratings.find(
      (r) => (r.user?._id?.toString() ?? r.user?.toString()) === userId
    );

    if (existing) existing.stars = stars;
    else game.ratings.push({ user: userId, stars });

    // Update user history
    const user = await User.findById(userId);
    const uRated = user.ratedGames.find(
      (r) => r.game.toString() === game._id.toString()
    );

    if (uRated) uRated.stars = stars;
    else user.ratedGames.push({ game: game._id, stars });

    // Recalculate rating
    const total = game.ratings.length;
    const sum = game.ratings.reduce((a, r) => a + r.stars, 0);

    game.totalRatings = total;
    game.averageRating = Number((sum / total).toFixed(2));

    await user.save();
    await game.save();

    return res.json({
      success: true,
      rating: game.averageRating,
      totalRatings: game.totalRatings,
      userRating: stars,
    });
  } catch (err) {
    console.error("RATE GAME ERROR:", err);
    return res.status(500).json({ message: "Failed to rate game" });
  }
};

