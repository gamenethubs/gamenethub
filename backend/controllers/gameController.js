


// import Game from "../models/Game.js";
// import User from "../models/User.js";
// import extract from "extract-zip";
// import fs from "fs";
// import path from "path";
// import slugify from "slugify";

// /********************************************************
//  * ⭐ RENDER PERSISTENT DISK PATHS
//  * UPLOAD_PATH: /var/data/uploads 
//  * GAME_PATH: /var/data/uploads/games 
//  ********************************************************/
// const UPLOADS_ROOT = process.env.UPLOAD_PATH;
// const GAME_EXTRACT_ROOT = process.env.GAME_PATH;

// // Initial Check (Safety)
// if (!UPLOADS_ROOT || !GAME_EXTRACT_ROOT) {
//   console.error("❌ ERROR: UPLOAD_PATH or GAME_PATH is missing from environment variables.");
// }

// /*******************************************
//  * ⭐ UTILITY — Inject tracker.js inside index.html
//  *******************************************/
// const injectTrackerIntoIndex = (indexPath) => {
//   try {
//     if (!fs.existsSync(indexPath)) return;

//     let html = fs.readFileSync(indexPath, "utf8");

//     // If already injected → skip
//     if (html.includes("tracker.js")) {
//       console.log("⚠️ tracker.js already injected:", indexPath);
//       return;
//     }

//     const scriptTag = `<script src="/games/common/tracker.js"></script>`;

//     // Prefer to inject before </body>
//     if (html.includes("</body>")) {
//       html = html.replace("</body>", `${scriptTag}\n</body>`);
//     } else {
//       // Worst case → end of file
//       html += `\n${scriptTag}`;
//     }

//     fs.writeFileSync(indexPath, html, "utf8");
//     console.log("🟢 tracker.js injected into:", indexPath);

//   } catch (err) {
//     console.error("❌ TRACKER INJECTION FAILED:", err);
//   }
// };

// /*******************************************
//  * SCORE CALCULATIONS (Correct)
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
//  * GET ALL GAMES (Correct)
//  *******************************************/
// export const getAllGames = async (req, res) => {
//   try {
//     const games = await Game.find()
//       .sort({ createdAt: -1 })
//       .populate("ratings.user", "_id name email")
//       .lean();

//     const finalGames = games.map((g) => ({
//       ...g,
//       trendingScore: calculateTrendingScore(g),
//       popularScore: calculatePopularScore(g),
//     }));

//     return res.json({ success: true, games: finalGames });
//   } catch (err) {
//     console.error("FETCH ALL GAMES ERROR:", err);
//     return res.status(500).json({ message: "Failed to fetch games" });
//   }
// };

// /*******************************************
//  * GET GAME BY ID (Correct)
//  *******************************************/
// export const getGameById = async (req, res) => {
//   try {
//     const g = await Game.findById(req.params.id)
//       .populate("ratings.user", "_id name email")
//       .lean();

//     if (!g) return res.status(404).json({ message: "Game not found" });

//     return res.json({
//       success: true,
//       game: {
//         ...g,
//         trendingScore: calculateTrendingScore(g),
//         popularScore: calculatePopularScore(g),
//       },
//     });
//   } catch (err) {
//     console.error("GET GAME BY ID ERROR:", err);
//     return res.status(500).json({ message: "Error fetching game" });
//   }
// };

// /*******************************************
//  * GET GAME BY SLUG (Correct)
//  *******************************************/
// export const getGameBySlug = async (req, res) => {
//   try {
//     const g = await Game.findOne({ slug: req.params.slug })
//       .populate("ratings.user", "_id name email")
//       .lean();

//     if (!g) return res.status(404).json({ message: "Game not found" });

//     return res.json({
//       success: true,
//       game: {
//         ...g,
//         trendingScore: calculateTrendingScore(g),
//         popularScore: calculatePopularScore(g),
//       },
//     });
//   } catch (err) {
//     console.error("GET GAME BY SLUG ERROR:", err);
//     return res.status(500).json({ message: "Error fetching game by slug" });
//   }
// };

// /*******************************************
//  * CREATE GAME — Fully Render / Persistent Disk Safe
//  *******************************************/
// export const createGame = async (req, res) => {
//   try {
//     const {
//       title,
//       genre,
//       description,
//       deviceCompatibility,
//       orientation,

//       // ⭐⭐⭐ NEW MULTIPLAYER FIELDS
//       isLocal,
//       isOnline

//     } = req.body;

//     if (!req.files?.thumbnail || !req.files?.gameZip) {
//       return res.status(400).json({
//         message: "Thumbnail & ZIP file required",
//       });
//     }

//     const slug = slugify(title, { lower: true, strict: true });

//     const thumbnailFile = req.files.thumbnail[0];
//     const zipFile = req.files.gameZip[0];

//     // URLs stored in DB (These are correct based on server.js static setup)
//     const thumbnailURL = `/uploads/thumbnails/${thumbnailFile.filename}`;
//     const zipURL = `/uploads/zips/${zipFile.filename}`;

//     // Extraction directory on the Persistent Disk
//     const extractDir = path.join(GAME_EXTRACT_ROOT, slug);

//     // Remove old folder (on Persistent Disk)
//     if (fs.existsSync(extractDir)) fs.rmSync(extractDir, { recursive: true });
//     fs.mkdirSync(extractDir, { recursive: true });

//     // Extract ZIP file to Persistent Disk
//     try {
//       await extract(zipFile.path, { dir: extractDir });
//     } catch (err) {
//       console.error("ZIP EXTRACT ERROR:", err);
//       return res.status(400).json({ message: "Invalid ZIP file" });
//     }

//     // Find index.html inside extracted folder
//     let indexPath = "";
//     const scan = (dir) => {
//       for (const item of fs.readdirSync(dir)) {
//         const full = path.join(dir, item);
//         if (fs.statSync(full).isDirectory()) scan(full);
//         else if (item.toLowerCase() === "index.html") indexPath = full;
//       }
//     };
//     scan(extractDir);

//     if (!indexPath) {
//       return res.status(400).json({ message: "index.html NOT found in ZIP" });
//     }

//     // ⭐ INJECT tracker.js INTO index.html
//     injectTrackerIntoIndex(indexPath);

//     // ⭐ FIX path issue
//     const pathAfterExtractRoot =
//       indexPath.replace(GAME_EXTRACT_ROOT, "").replace(/\\/g, "/");
//     const playUrl = `/games${pathAfterExtractRoot}`;

//     const game = await Game.create({
//       title,
//       slug,
//       genre,
//       description,
//       thumbnail: thumbnailURL,
//       gameZip: zipURL,
//       playUrl,

//       // ⭐ NEW FIELD ADDED
//       deviceCompatibility: deviceCompatibility || "all",
//       orientation: orientation || "all",

//       // ⭐⭐⭐ NEW MULTIPLAYER ADDED
//       isLocal: isLocal === "true" || isLocal === true,
//       isOnline: isOnline === "true" || isOnline === true,

//       averageRating: 4.0,
//       totalRatings: 0,
//       ratings: [],
//       playedIPs: [],
//       playCount: 0,
//     });

//     // 🔔 Notify all connected users (real-time)
//     req.io.emit("new-game-added", {
//       id: game._id,
//       title: game.title,
//       slug: game.slug,
//       thumbnail: game.thumbnail,
//       genre: game.genre,
//     });


//     return res.json({
//       success: true,
//       message: "Game uploaded successfully",
//       game: {
//         ...game._doc,
//         trendingScore: calculateTrendingScore(game),
//         popularScore: calculatePopularScore(game),
//       },
//     });
//   } catch (err) {
//     console.error("UPLOAD GAME ERROR:", err);
//     return res.status(500).json({ message: "Failed to upload game" });
//   }
// };

// /*******************************************
//  * UPDATE GAME
//  *******************************************/
// export const updateGame = async (req, res) => {
//   try {
//     const game = await Game.findById(req.params.id);
//     if (!game) return res.status(404).json({ message: "Game not found" });

//     const {
//       title,
//       genre,
//       description,
//       deviceCompatibility,
//       orientation,

//       // ⭐⭐⭐ NEW MULTIPLAYER
//       isLocal,
//       isOnline
//     } = req.body;

//     const newSlug = slugify(title, { lower: true, strict: true });

//     let thumbnailURL = game.thumbnail;
//     let zipURL = game.gameZip;
//     let playUrl = game.playUrl;

//     // Thumbnail update
//     if (req.files?.thumbnail?.[0]) {
//       thumbnailURL = `/uploads/thumbnails/${req.files.thumbnail[0].filename}`;
//     }

//     // ZIP update
//     if (req.files?.gameZip?.[0]) {
//       const zipFile = req.files.gameZip[0];
//       zipURL = `/uploads/zips/${zipFile.filename}`;

//       const extractDir = path.join(GAME_EXTRACT_ROOT, newSlug);

//       // Remove old folder (on Persistent Disk)
//       if (fs.existsSync(extractDir)) fs.rmSync(extractDir, { recursive: true });
//       fs.mkdirSync(extractDir, { recursive: true });

//       try {
//         // Extract to Persistent Disk
//         await extract(zipFile.path, { dir: extractDir });
//       } catch (err) {
//         console.error("ZIP UPDATE ERROR:", err);
//         return res.status(400).json({ message: "Invalid ZIP file" });
//       }

//       let indexPath = "";
//       const scan = (dir) => {
//         for (const item of fs.readdirSync(dir)) {
//           const full = path.join(dir, item);
//           if (fs.statSync(full).isDirectory()) scan(full);
//           else if (item.toLowerCase() === "index.html") indexPath = full;
//         }
//       };
//       scan(extractDir);

//       if (!indexPath)
//         return res.status(400).json({ message: "index.html not found" });

//       // ⭐ INJECT tracker.js INTO UPDATED index.html
//       injectTrackerIntoIndex(indexPath);

//       // ⭐ FINAL FIX APPLIED HERE
//       const pathAfterExtractRoot =
//         indexPath.replace(GAME_EXTRACT_ROOT, "").replace(/\\/g, "/");
//       playUrl = `/games${pathAfterExtractRoot}`;
//     }

//     // Apply updates
//     game.title = title;
//     game.slug = newSlug;
//     game.genre = genre;
//     game.description = description;
//     game.thumbnail = thumbnailURL;
//     game.gameZip = zipURL;
//     game.playUrl = playUrl;

//     // ⭐ NEW FIELD UPDATE
//     if (deviceCompatibility) {
//       game.deviceCompatibility = deviceCompatibility;
//     }
//     if (orientation) {
//       game.orientation = orientation;
//     }

//     // ⭐⭐⭐ NEW MULTIPLAYER UPDATE
//     if (typeof isLocal !== "undefined") {
//       game.isLocal = isLocal === "true" || isLocal === true;
//     }
//     if (typeof isOnline !== "undefined") {
//       game.isOnline = isOnline === "true" || isOnline === true;
//     }

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
//     console.error("UPDATE GAME ERROR:", err);
//     return res.status(500).json({ message: "Failed to update game" });
//   }
// };

// /*******************************************
//  * DELETE GAME (Correct)
//  *******************************************/
// export const deleteGame = async (req, res) => {
//   try {
//     const g = await Game.findByIdAndDelete(req.params.id);
//     if (!g) return res.status(404).json({ message: "Game not found" });

//     // Delete the game folder from the Persistent Disk
//     const folder = path.join(GAME_EXTRACT_ROOT, g.slug);
//     if (fs.existsSync(folder)) fs.rmSync(folder, { recursive: true });

//     return res.json({
//       success: true,
//       message: "Game deleted successfully",
//     });
//   } catch (err) {
//     console.error("DELETE GAME ERROR:", err);
//     return res.status(500).json({ message: "Failed to delete game" });
//   }
// };

// /*******************************************
//  * INCREASE PLAY COUNT (Correct)
//  *******************************************/
// export const increasePlayCount = async (req, res) => {
//   try {
//     const game = await Game.findById(req.params.id);
//     if (!game) return res.status(404).json({ message: "Game not found" });

//     game.playCount += 1;
//     await game.save();

//     return res.json({
//       success: true,
//       playCount: game.playCount,
//     });
//   } catch (err) {
//     console.error("PLAY COUNT ERROR:", err);
//     return res.status(500).json({ message: "Failed to increase play" });
//   }
// };

// /*******************************************
//  * USER RATING SYSTEM (Correct)
//  *******************************************/
// export const rateGame = async (req, res) => {
//   try {
//     const userId = req.user?._id?.toString();
//     if (!userId) {
//       return res.status(401).json({ message: "Login required" });
//     }

//     const { stars } = req.body;
//     if (!stars || stars < 1 || stars > 5) {
//       return res.status(400).json({ message: "Stars must be 1–5" });
//     }

//     const game = await Game.findById(req.params.id);
//     if (!game) return res.status(404).json({ message: "Game not found" });

//     // Update rating
//     const existing = game.ratings.find(
//       (r) => (r.user?._id?.toString() ?? r.user?.toString()) === userId
//     );

//     if (existing) existing.stars = stars;
//     else game.ratings.push({ user: userId, stars });

//     // Update user history
//     const user = await User.findById(userId);
//     const uRated = user.ratedGames.find(
//       (r) => r.game.toString() === game._id.toString()
//     );

//     if (uRated) uRated.stars = stars;
//     else user.ratedGames.push({ game: game._id, stars });

//     // Recalculate rating
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
//     console.error("RATE GAME ERROR:", err);
//     return res.status(500).json({ message: "Failed to rate game" });
//   }
// };


import Game from "../models/Game.js";
import User from "../models/User.js";
import extract from "extract-zip";
import fs from "fs";
import path from "path";
import slugify from "slugify";

/********************************************************
 * ⭐ RENDER PERSISTENT DISK PATHS
 * UPLOAD_PATH: /var/data/uploads 
 * GAME_PATH: /var/data/uploads/games 
 ********************************************************/
const UPLOADS_ROOT = process.env.UPLOAD_PATH;
const GAME_EXTRACT_ROOT = process.env.GAME_PATH;

// Initial Check (Safety)
if (!UPLOADS_ROOT || !GAME_EXTRACT_ROOT) {
  console.error("❌ ERROR: UPLOAD_PATH or GAME_PATH is missing from environment variables.");
}

/*******************************************
 * ⭐ UTILITY — Inject tracker.js inside index.html
 *******************************************/
const injectTrackerIntoIndex = (indexPath) => {
  try {
    if (!fs.existsSync(indexPath)) return;

    let html = fs.readFileSync(indexPath, "utf8");

    // If already injected → skip
    if (html.includes("tracker.js")) {
      console.log("⚠️ tracker.js already injected:", indexPath);
      return;
    }

    const scriptTag = `<script src="/games/common/tracker.js"></script>`;

    // Prefer to inject before </body>
    if (html.includes("</body>")) {
      html = html.replace("</body>", `${scriptTag}\n</body>`);
    } else {
      // Worst case → end of file
      html += `\n${scriptTag}`;
    }

    fs.writeFileSync(indexPath, html, "utf8");
    console.log("🟢 tracker.js injected into:", indexPath);

  } catch (err) {
    console.error("❌ TRACKER INJECTION FAILED:", err);
  }
};

/*******************************************
 * SCORE CALCULATIONS (Correct)
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
 * GET ALL GAMES (Correct)
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
 * GET GAME BY ID (Correct)
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
 * GET GAME BY SLUG (Correct)
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
    const {
      title,
      genre,
      description,
      deviceCompatibility,
      orientation,

      // ⭐⭐⭐ NEW MULTIPLAYER FIELDS
      isLocal,
      isOnline,

      // ⭐⭐⭐⭐ NEW KIDS FIELDS
      isKids,
      kidsArenas
    } = req.body;

    if (!req.files?.thumbnail || !req.files?.gameZip) {
      return res.status(400).json({
        message: "Thumbnail & ZIP file required",
      });
    }

    const slug = slugify(title, { lower: true, strict: true });

    const thumbnailFile = req.files.thumbnail[0];
    const zipFile = req.files.gameZip[0];

    // URLs stored in DB
    const thumbnailURL = `/uploads/thumbnails/${thumbnailFile.filename}`;
    const zipURL = `/uploads/zips/${zipFile.filename}`;

    // Extraction directory on the Persistent Disk
    const extractDir = path.join(GAME_EXTRACT_ROOT, slug);

    if (fs.existsSync(extractDir)) fs.rmSync(extractDir, { recursive: true });
    fs.mkdirSync(extractDir, { recursive: true });

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

    // ⭐ Inject tracker.js
    injectTrackerIntoIndex(indexPath);

    const pathAfterExtractRoot =
      indexPath.replace(GAME_EXTRACT_ROOT, "").replace(/\\/g, "/");
    const playUrl = `/games${pathAfterExtractRoot}`;

    // ⭐ FIXED: Kids arrays handled safely
    const finalKidsArenas = Array.isArray(kidsArenas)
      ? kidsArenas
      : kidsArenas
      ? [kidsArenas]
      : [];

    const game = await Game.create({
      title,
      slug,
      genre,
      description,
      thumbnail: thumbnailURL,
      gameZip: zipURL,
      playUrl,

      // ⭐ NEW FIELD
      deviceCompatibility: deviceCompatibility || "all",
      orientation: orientation || "all",

      // ⭐⭐⭐ NEW MULTIPLAYER
      isLocal: isLocal === "true" || isLocal === true,
      isOnline: isOnline === "true" || isOnline === true,

      // ⭐⭐⭐⭐ NEW KIDS FIELDS
      isKids: isKids === "true" || isKids === true,
      kidsArenas: finalKidsArenas,

      averageRating: 4.0,
      totalRatings: 0,
      ratings: [],
      playedIPs: [],
      playCount: 0,
    });

    // 🔔 Notify real-time users
    req.io.emit("new-game-added", {
      id: game._id,
      title: game.title,
      slug: game.slug,
      thumbnail: game.thumbnail,
      genre: game.genre,
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

    const {
      title,
      genre,
      description,
      deviceCompatibility,
      orientation,

      // ⭐⭐⭐ MULTIPLAYER
      isLocal,
      isOnline,

      // ⭐⭐⭐⭐ KIDS
      isKids,
      kidsArenas
    } = req.body;

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

      injectTrackerIntoIndex(indexPath);

      const pathAfterExtractRoot =
        indexPath.replace(GAME_EXTRACT_ROOT, "").replace(/\\/g, "/");
      playUrl = `/games${pathAfterExtractRoot}`;
    }

    // Save updates
    game.title = title;
    game.slug = newSlug;
    game.genre = genre;
    game.description = description;
    game.thumbnail = thumbnailURL;
    game.gameZip = zipURL;
    game.playUrl = playUrl;

    // ⭐ NEW FIELDS
    if (deviceCompatibility) game.deviceCompatibility = deviceCompatibility;
    if (orientation) game.orientation = orientation;

    // ⭐⭐⭐ MULTIPLAYER
    if (typeof isLocal !== "undefined")
      game.isLocal = isLocal === "true" || isLocal === true;

    if (typeof isOnline !== "undefined")
      game.isOnline = isOnline === "true" || isOnline === true;

    // ⭐⭐⭐⭐ KIDS — FIXED ARRAY HANDLING
    if (typeof isKids !== "undefined")
      game.isKids = isKids === "true" || isKids === true;

    // ⭐⭐⭐ FIX — Kids Mode (full support)
if (typeof isKids !== "undefined") {
  game.isKids = isKids === "true" || isKids === true;
}

if (kidsArenas) {
  const arr = Array.isArray(kidsArenas) ? kidsArenas : [kidsArenas];
  game.kidsArenas = arr.filter(Boolean); // remove null/empty
}


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
 * DELETE GAME (Correct)
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
 * INCREASE PLAY COUNT (Correct)
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
 * USER RATING SYSTEM (Correct)
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

    const existing = game.ratings.find(
      (r) => (r.user?._id?.toString() ?? r.user?.toString()) === userId
    );

    if (existing) existing.stars = stars;
    else game.ratings.push({ user: userId, stars });

    const user = await User.findById(userId);
    const uRated = user.ratedGames.find(
      (r) => r.game.toString() === game._id.toString()
    );

    if (uRated) uRated.stars = stars;
    else user.ratedGames.push({ game: game._id, stars });

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
