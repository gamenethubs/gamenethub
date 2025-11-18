// // backend/controllers/favoriteController.js
// import User from "../models/User.js";
// import Game from "../models/Game.js";

// /***************************************************
//  * ⭐ ADD / REMOVE FROM FAVORITES (TOGGLE SYSTEM)
//  ***************************************************/
// export const toggleFavorite = async (req, res) => {
//   try {
//     const userId = req.user._id;  // from protect middleware
//     const gameId = req.params.gameId;

//     const user = await User.findById(userId);
//     const game = await Game.findById(gameId);

//     if (!game) {
//       return res.status(404).json({ message: "Game not found" });
//     }

//     // Force to string for clean comparison
//     const exists = user.favorites.some((id) => id.toString() === gameId);

//     if (exists) {
//       // ⭐ REMOVE FROM FAVORITES
//       user.favorites = user.favorites.filter(
//         (id) => id.toString() !== gameId
//       );
//       await user.save();

//       const populated = await user.populate(
//         "favorites",
//         "title slug thumbnail genre rating playCount"
//       );

//       return res.json({
//         success: true,
//         action: "removed",
//         favorites: populated.favorites,
//       });
//     }

//     // ⭐ ADD TO FAVORITES
//     user.favorites.push(gameId);
//     await user.save();

//     const populated = await user.populate(
//       "favorites",
//       "title slug thumbnail genre rating playCount"
//     );

//     return res.json({
//       success: true,
//       action: "added",
//       favorites: populated.favorites,
//     });

//   } catch (err) {
//     console.error("FAVORITE TOGGLE ERROR:", err);
//     return res.status(500).json({ message: "Failed to update favorites" });
//   }
// };


// /***************************************************
//  * ⭐ GET LOGGED-IN USER FAVORITES
//  ***************************************************/
// export const getUserFavorites = async (req, res) => {
//   try {
//     const userId = req.user._id;

//     const user = await User.findById(userId).populate(
//       "favorites",
//       "title slug thumbnail genre rating playCount"
//     );

//     return res.json({
//       success: true,
//       favorites: user.favorites || [],
//     });

//   } catch (err) {
//     console.error("FETCH FAV ERROR:", err);
//     return res.status(500).json({ message: "Failed to fetch favorites" });
//   }
// };


// backend/controllers/favoriteController.js
import User from "../models/User.js";
import Game from "../models/Game.js";
import mongoose from "mongoose";

/********************************************
 * ⭐ Validate ObjectId (Prevents server crash)
 ********************************************/
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

/***************************************************
 * ⭐ TOGGLE FAVORITE — Add if missing / Remove if exists
 ***************************************************/
export const toggleFavorite = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const gameId = req.params.gameId;

    // Validate ObjectId
    if (!gameId || !isValidObjectId(gameId)) {
      return res.status(400).json({ message: "Invalid Game ID" });
    }

    // Check if game exists (FAST)
    const gameExists = await Game.exists({ _id: gameId });
    if (!gameExists) {
      return res.status(404).json({ message: "Game not found" });
    }

    // Fetch user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const alreadyFavorite = user.favorites.some(
      (fav) => fav.toString() === gameId
    );

    /*******************************************
     * ⭐ REMOVE from favorites
     *******************************************/
    if (alreadyFavorite) {
      user.favorites = user.favorites.filter(
        (fav) => fav.toString() !== gameId
      );
      await user.save();

      const populated = await User.findById(userId)
        .populate({
          path: "favorites",
          select: "title slug thumbnail genre averageRating playCount",
          options: { sort: { createdAt: -1 } },
        })
        .select("favorites");

      return res.json({
        success: true,
        action: "removed",
        favorites: populated.favorites,
      });
    }

    /*******************************************
     * ⭐ ADD to favorites
     *******************************************/
    user.favorites.push(gameId);
    await user.save();

    const populated = await User.findById(userId)
      .populate({
        path: "favorites",
        select: "title slug thumbnail genre averageRating playCount",
        options: { sort: { createdAt: -1 } },
      })
      .select("favorites");

    return res.json({
      success: true,
      action: "added",
      favorites: populated.favorites,
    });
  } catch (err) {
    console.error("🔥 FAVORITE TOGGLE ERROR:", err.message);
    return res.status(500).json({ message: "Failed to update favorites" });
  }
};

/***************************************************
 * ⭐ GET ALL FAVORITES (Optimized & Lean)
 ***************************************************/
export const getUserFavorites = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId)
      .populate({
        path: "favorites",
        select: "title slug thumbnail genre averageRating playCount",
        options: { sort: { createdAt: -1 } },
      })
      .lean();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({
      success: true,
      favorites: user.favorites || [],
    });
  } catch (err) {
    console.error("🔥 FETCH FAVORITES ERROR:", err.message);
    return res.status(500).json({ message: "Failed to fetch favorites" });
  }
};


