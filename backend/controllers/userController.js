// // backend/controllers/userController.js
// import User from "../models/User.js";
// import generateUsername from "../utils/generateUsername.js";

// /************************************
//  * 🔹 GET LOGGED-IN USER PROFILE
//  ************************************/
// export const getMyProfile = async (req, res) => {
//   try {
//     return res.json({
//       success: true,
//       user: req.user, // already without password
//     });
//   } catch (err) {
//     console.error("🔥 GET MY PROFILE ERROR:", err.message);
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// /************************************
//  * 🔹 UPDATE PROFILE
//  ************************************/
// export const updateProfile = async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id);
//     if (!user)
//       return res.status(404).json({ success: false, message: "User not found" });

//     const { name, username, avatar, bio, social } = req.body;

//     /************************************
//      * UPDATE NAME
//      ************************************/
//     if (name && name !== user.name) {
//       user.name = name;
//     }

//     /************************************
//      * UPDATE USERNAME (UNIQUE)
//      ************************************/
//     if (username && username !== user.username) {
//       const exists = await User.findOne({ username });
//       if (exists) {
//         return res.status(400).json({
//           success: false,
//           message: "Username already taken",
//         });
//       }
//       user.username = username.trim().toLowerCase();
//     }

//     /************************************
//      * UPDATE AVATAR
//      ************************************/
//     if (avatar) {
//       user.avatar = avatar; // frontend sends "/avatars/avatar03.png"
//     }

//     /************************************
//      * BIO UPDATE
//      ************************************/
//     if (bio !== undefined) {
//       user.bio = bio;
//     }

//     /************************************
//      * SOCIAL LINKS UPDATE
//      ************************************/
//     if (social) {
//       user.social.instagram = social.instagram || "";
//       user.social.twitter = social.twitter || "";
//       user.social.linkedin = social.linkedin || "";
//     }

//     await user.save();

//     return res.json({
//       success: true,
//       message: "Profile updated",
//       user,
//     });
//   } catch (err) {
//     console.error("🔥 UPDATE PROFILE ERROR:", err.message);
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// /************************************
//  * 🔹 SEARCH USERS BY USERNAME
//  ************************************/
// export const searchUsers = async (req, res) => {
//   try {
//     const q = req.query.q?.trim().toLowerCase();
//     if (!q) return res.json([]);

//     const users = await User.find({
//       username: { $regex: q, $options: "i" },
//     })
//       .select("name username avatar")
//       .limit(20);

//     return res.json(users);
//   } catch (err) {
//     console.error("🔥 SEARCH USERS ERROR:", err.message);
//     return res.status(500).json({ message: "Server error" });
//   }
// };

// /************************************
//  * 🔹 GET PUBLIC PROFILE BY USERNAME
//  ************************************/
// // export const getPublicProfile = async (req, res) => {
// //   try {
// //     const username = req.params.username.toLowerCase();

// //     const user = await User.findOne({ username })
// //       .select("-password -email -googleId -favorites -ratedGames");

// //     if (!user)
// //       return res.status(404).json({ message: "User not found" });

// //     return res.json({
// //       success: true,
// //       user,
// //     });
// //   } catch (err) {
// //     console.error("🔥 PUBLIC PROFILE ERROR:", err.message);
// //     return res.status(500).json({ message: "Server error" });
// //   }
// // };

// /************************************
//  * 🔹 GET PUBLIC PROFILE BY USERNAME
//  ************************************/
// /************************************
//  * 🔹 GET PUBLIC PROFILE BY USERNAME  (FINAL PERFECT VERSION)
//  ************************************/
// export const getPublicProfile = async (req, res) => {
//   try {
//     const viewerId = req.user?._id || null;
//     const username = (req.params.username || "").trim().toLowerCase();

//     // Fetch target user
//     const user = await User.findOne({ username })
//       .select("-password -email -googleId -ratedGames")
//       .populate("favorites", "title slug thumbnail genre")
//       .populate("friends", "name username avatar lastSeen");

//     if (!user)
//       return res.status(404).json({ message: "User not found" });

//     // Relationship
//     let relationship = "none";

//     if (viewerId) {
//       const me = await User.findById(viewerId)
//         .select("friends incomingRequests outgoingRequests")
//         .lean();

//       const targetId = user._id.toString();
//       const myFriendIds = (me.friends || []).map(f => f.toString());

//       if (myFriendIds.includes(targetId)) {
//         relationship = "friend";
//       } else if (
//         (me.outgoingRequests || []).some(r => r.to && r.to.toString() === targetId)
//       ) {
//         relationship = "outgoing";
//       } else if (
//         (me.incomingRequests || []).some(r => r.from && r.from.toString() === targetId)
//       ) {
//         relationship = "incoming";
//       }
//     }

//     // Mutual friends (clean)
//     let mutualFriends = [];
//     if (viewerId) {
//       const me = await User.findById(viewerId).select("friends").lean();
//       const viewerFriendIds = (me.friends || []).map(f => f.toString());

//       mutualFriends = (user.friends || [])
//         .filter(f => viewerFriendIds.includes(f._id.toString()))
//         .map(f => ({
//           id: f._id.toString(),
//           username: f.username,
//           avatar: f.avatar,
//           name: f.name,
//         }));
//     }

//     // Online logic (correct 2 min threshold)
//     let online = false;
//     if (user.lastSeen) {
//       const diff = Date.now() - new Date(user.lastSeen).getTime();
//       online = diff < 2 * 60 * 1000;
//     }

//     return res.json({
//       success: true,
//       user: {
//         id: user._id.toString(),
//         name: user.name,
//         username: user.username,
//         avatar: user.avatar,
//         bio: user.bio,
//         social: user.social,
//         favorites: user.favorites,
//         mutualFriends,
//         relationship,
//         online
//       }
//     });

//   } catch (err) {
//     console.error("🔥 PUBLIC PROFILE ERROR:", err);
//     return res.status(500).json({ message: "Server error" });
//   }
// };


// // backend/controllers/userController.js
// import User from "../models/User.js";
// import generateUsername from "../utils/generateUsername.js";

// /************************************
//  * 🔹 GET LOGGED-IN USER PROFILE
//  ************************************/
// export const getMyProfile = async (req, res) => {
//   try {
//     return res.json({
//       success: true,
//       user: req.user, // already without password
//     });
//   } catch (err) {
//     console.error("🔥 GET MY PROFILE ERROR:", err.message);
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// /************************************
//  * 🔹 UPDATE PROFILE
//  ************************************/
// export const updateProfile = async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id);
//     if (!user)
//       return res.status(404).json({ success: false, message: "User not found" });

//     const { name, username, avatar, bio, social } = req.body;

//     /************************************
//      * UPDATE NAME
//      ************************************/
//     if (name && name !== user.name) {
//       user.name = name;
//     }

//     /************************************
//      * UPDATE USERNAME (UNIQUE)
//      ************************************/
//     if (username && username !== user.username) {
//       const exists = await User.findOne({ username });
//       if (exists) {
//         return res.status(400).json({
//           success: false,
//           message: "Username already taken",
//         });
//       }
//       user.username = username.trim().toLowerCase();
//     }

//     /************************************
//      * UPDATE AVATAR
//      ************************************/
//     if (avatar) {
//       user.avatar = avatar; // frontend sends "/avatars/avatar03.png"
//     }

//     /************************************
//      * BIO UPDATE
//      ************************************/
//     if (bio !== undefined) {
//       user.bio = bio;
//     }

//     /************************************
//      * SOCIAL LINKS UPDATE
//      ************************************/
//     if (social) {
//       user.social.instagram = social.instagram || "";
//       user.social.twitter = social.twitter || "";
//       user.social.linkedin = social.linkedin || "";
//     }

//     await user.save();

//     return res.json({
//       success: true,
//       message: "Profile updated",
//       user,
//     });
//   } catch (err) {
//     console.error("🔥 UPDATE PROFILE ERROR:", err.message);
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// /************************************
//  * 🔹 SEARCH USERS BY USERNAME
//  ************************************/
// export const searchUsers = async (req, res) => {
//   try {
//     const q = req.query.q?.trim().toLowerCase();
//     if (!q) return res.json([]);

//     const users = await User.find({
//       username: { $regex: q, $options: "i" },
//     })
//       .select("name username avatar _id")   // ensure _id present for frontend
//       .limit(20);

//     return res.json(users);
//   } catch (err) {
//     console.error("🔥 SEARCH USERS ERROR:", err.message);
//     return res.status(500).json({ message: "Server error" });
//   }
// };

// /************************************
//  * 🔹 GET PUBLIC PROFILE BY USERNAME  (FINAL)
//  ************************************/
// export const getPublicProfile = async (req, res) => {
//   try {
//     const viewerId = req.user?._id || null;
//     const username = (req.params.username || "").trim().toLowerCase();

//     const user = await User.findOne({ username })
//       .select("-password -email -googleId -ratedGames")
//       .populate("favorites", "title slug thumbnail genre")
//       .populate("friends", "name username avatar lastSeen");

//     if (!user)
//       return res.status(404).json({ message: "User not found" });

//     let relationship = "none";

//     if (viewerId) {
//       const me = await User.findById(viewerId)
//         .select("friends incomingRequests outgoingRequests")
//         .lean();

//       const targetId = user._id.toString();
//       const myFriendIds = (me.friends || []).map(f => f.toString());

//       if (myFriendIds.includes(targetId)) {
//         relationship = "friend";
//       } else if (
//         (me.outgoingRequests || []).some(r => r.to && r.to.toString() === targetId)
//       ) {
//         relationship = "outgoing";
//       } else if (
//         (me.incomingRequests || []).some(r => r.from && r.from.toString() === targetId)
//       ) {
//         relationship = "incoming";
//       }
//     }

//     /************************************
//      * ⭐ MUTUAL FRIENDS (clean shape)
//      ************************************/
//     let mutualFriends = [];
//     if (viewerId) {
//       const me = await User.findById(viewerId).select("friends").lean();
//       const viewerFriendIds = (me.friends || []).map(f => f.toString());

//       mutualFriends = (user.friends || [])
//         .filter(f => viewerFriendIds.includes(f._id.toString()))
//         .map(f => ({
//           _id: f._id.toString(),
//           username: f.username,
//           avatar: f.avatar,
//           name: f.name,
//         }));
//     }

//     // Online logic (2 minute threshold)
//     let online = false;
//     if (user.lastSeen) {
//       const diff = Date.now() - new Date(user.lastSeen).getTime();
//       online = diff < 2 * 60 * 1000;
//     }

//     return res.json({
//       success: true,
//       user: {
//         _id: user._id.toString(),
//         name: user.name,
//         username: user.username,
//         avatar: user.avatar,
//         bio: user.bio,
//         social: user.social,
//         favorites: user.favorites,
//         mutualFriends,
//         relationship,
//         online,
//         lastSeen: user.lastSeen,
//       },
//     });

//   } catch (err) {
//     console.error("🔥 PUBLIC PROFILE ERROR:", err);
//     return res.status(500).json({ message: "Server error" });
//   }
// };

// // backend/controllers/userController.js
// import User from "../models/User.js";
// import generateUsername from "../utils/generateUsername.js";

// /************************************
//  * 🔹 GET LOGGED-IN USER PROFILE
//  ************************************/
// export const getMyProfile = async (req, res) => {
//   try {
//     return res.json({
//       success: true,
//       user: req.user,
//     });
//   } catch (err) {
//     console.error("🔥 GET MY PROFILE ERROR:", err.message);
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// /************************************
//  * 🔹 UPDATE PROFILE
//  ************************************/
// export const updateProfile = async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id);
//     if (!user)
//       return res.status(404).json({ success: false, message: "User not found" });

//     const { name, username, avatar, bio, social } = req.body;

//     if (name && name !== user.name) {
//       user.name = name;
//     }

//     if (username && username !== user.username) {
//       const exists = await User.findOne({ username: username.trim().toLowerCase() });
//       if (exists)
//         return res.status(400).json({ success: false, message: "Username already taken" });

//       user.username = username.trim().toLowerCase();
//     }

//     if (avatar) user.avatar = avatar;
//     if (bio !== undefined) user.bio = bio;

//     if (social) {
//       user.social.instagram = social.instagram || "";
//       user.social.twitter = social.twitter || "";
//       user.social.linkedin = social.linkedin || "";
//     }

//     await user.save();

//     return res.json({
//       success: true,
//       message: "Profile updated",
//       user,
//     });
//   } catch (err) {
//     console.error("🔥 UPDATE PROFILE ERROR:", err.message);
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// /************************************
//  * 🔹 SEARCH USERS (used in FriendsModal)
//  ************************************/
// export const searchUsers = async (req, res) => {
//   try {
//     const q = req.query.q?.trim().toLowerCase();
//     if (!q) return res.json([]);

//     const users = await User.find({
//       username: { $regex: q, $options: "i" },
//     })
//       .select("name username avatar _id")
//       .limit(20);

//     return res.json(users);
//   } catch (err) {
//     console.error("🔥 SEARCH USERS ERROR:", err.message);
//     return res.status(500).json({ message: "Server error" });
//   }
// };

// /************************************
//  * 🔹 PUBLIC PROFILE WITH MUTUAL FRIENDS + RELATIONSHIP
//  ************************************/
// export const getPublicProfile = async (req, res) => {
//   try {
//     const viewerId = req.user?._id || null;
//     const username = (req.params.username || "").trim().toLowerCase();

//     const user = await User.findOne({ username })
//       .select("-password -email -googleId -ratedGames")
//       .populate("favorites", "title slug thumbnail genre")
//       .populate("friends", "name username avatar lastSeen _id");

//     if (!user)
//       return res.status(404).json({ message: "User not found" });

//     let relationship = "none";
//     let mutualFriends = [];

//     if (viewerId) {
//       const me = await User.findById(viewerId)
//         .select("friends incomingRequests outgoingRequests")
//         .lean();

//       const targetId = user._id.toString();
//       const myFriends = (me.friends || []).map(f => f.toString());

//       if (myFriends.includes(targetId)) relationship = "friend";
//       else if (
//         me.outgoingRequests?.some(r => r.to?.toString() === targetId)
//       ) relationship = "outgoing";
//       else if (
//         me.incomingRequests?.some(r => r.from?.toString() === targetId)
//       ) relationship = "incoming";

//       // MUTUAL FRIENDS FIX
//       mutualFriends = user.friends
//         .filter(f => myFriends.includes(f._id.toString()))
//         .map(f => ({
//           _id: f._id.toString(),
//           username: f.username,
//           avatar: f.avatar,
//           name: f.name,
//         }));
//     }

//     // ONLINE CHECK (2 min)
//     let online = false;
//     if (user.lastSeen) {
//       online = Date.now() - new Date(user.lastSeen).getTime() < 120000;
//     }

//     return res.json({
//       success: true,
//       user: {
//         _id: user._id.toString(),
//         username: user.username,
//         name: user.name,
//         avatar: user.avatar,
//         bio: user.bio,
//         social: user.social,
//         favorites: user.favorites,
//         mutualFriends,
//         relationship,
//         online,
//       },
//     });

//   } catch (err) {
//     console.error("🔥 PUBLIC PROFILE ERROR:", err);
//     return res.status(500).json({ message: "Server error" });
//   }
// };


// backend/controllers/userController.js
import User from "../models/User.js";
import mongoose from "mongoose";

/************************************
 * 🔹 GET LOGGED-IN USER PROFILE
 * Returns a fully populated, normalized 'me' object the frontend expects:
 * - friends (array of { _id, username, avatar, name })
 * - incomingRequests (array of { from: { _id, username, avatar } })
 * - outgoingRequests (array of { to: { _id, username, avatar } })
 ************************************/
export const getMyProfile = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ success: false, message: "Not authenticated" });

    const me = await User.findById(userId)
      .select("-password -email -googleId")
      .populate("friends", "name username avatar _id")
      .populate("incomingRequests.from", "name username avatar _id")
      .populate("outgoingRequests.to", "name username avatar _id")
      .lean();

    if (!me) return res.status(404).json({ success: false, message: "User not found" });

    // Normalize ids to strings for frontend consistency
    const normalizeId = (o) => (o && o._id ? { ...o, _id: o._id.toString() } : o);

    const user = {
      ...me,
      _id: me._id.toString(),
      friends: (me.friends || []).map((f) => ({ _id: f._id.toString(), username: f.username, avatar: f.avatar, name: f.name })),
      incomingRequests: (me.incomingRequests || []).map((r) => ({
        from: r.from ? { _id: r.from._id.toString(), username: r.from.username, avatar: r.from.avatar, name: r.from.name } : null,
        createdAt: r.createdAt || null,
      })),
      outgoingRequests: (me.outgoingRequests || []).map((r) => ({
        to: r.to ? { _id: r.to._id.toString(), username: r.to.username, avatar: r.to.avatar, name: r.to.name } : null,
        createdAt: r.createdAt || null,
      })),
    };

    return res.json({ success: true, user });
  } catch (err) {
    console.error("🔥 GET MY PROFILE ERROR:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/************************************
 * 🔹 UPDATE PROFILE
 ************************************/
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    const { name, username, avatar, bio, social } = req.body;

    if (name && name !== user.name) user.name = name;

    if (username && username !== user.username) {
      const candidate = username.trim().toLowerCase();
      const exists = await User.findOne({ username: candidate });
      if (exists && exists._id.toString() !== user._id.toString())
        return res.status(400).json({ success: false, message: "Username already taken" });

      user.username = candidate;
    }

    if (avatar) user.avatar = avatar;
    if (bio !== undefined) user.bio = bio;

    if (social) {
      user.social = user.social || {};
      user.social.instagram = social.instagram || "";
      user.social.twitter = social.twitter || "";
      user.social.linkedin = social.linkedin || "";
    }

    await user.save();

    // Return updated sanitized user (no password/email)
    const updated = await User.findById(user._id)
      .select("-password -email -googleId")
      .populate("friends", "name username avatar _id")
      .lean();

    const responseUser = {
      ...updated,
      _id: updated._id.toString(),
      friends: (updated.friends || []).map((f) => ({ _id: f._id.toString(), username: f.username, avatar: f.avatar, name: f.name })),
    };

    return res.json({
      success: true,
      message: "Profile updated",
      user: responseUser,
    });
  } catch (err) {
    console.error("🔥 UPDATE PROFILE ERROR:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/************************************
 * 🔹 SEARCH USERS (used in FriendsModal)
 * Returns minimal fields and _id (string)
 ************************************/
export const searchUsers = async (req, res) => {
  try {
    const q = req.query.q?.trim();
    if (!q) return res.json([]);

    const regex = new RegExp(q, "i");
    const users = await User.find({
      username: { $regex: regex },
    })
      .select("name username avatar _id")
      .limit(20)
      .lean();

    const normalized = users.map(u => ({ ...u, _id: u._id.toString() }));
    return res.json(normalized);
  } catch (err) {
    console.error("🔥 SEARCH USERS ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/************************************
 * 🔹 PUBLIC PROFILE WITH MUTUAL FRIENDS + RELATIONSHIP
 * Returns: user { _id, username, name, avatar, bio, social, favorites, mutualFriends, relationship, online, lastSeen }
 ************************************/
export const getPublicProfile = async (req, res) => {
  try {
    const viewerId = req.user?._id ? req.user._id.toString() : null;
    const rawUsername = (req.params.username || "").trim();
    if (!rawUsername) return res.status(400).json({ message: "Missing username" });
    const username = rawUsername.toLowerCase();

    const user = await User.findOne({ username })
  .select("-password -email -googleId -ratedGames")
  .populate("favorites", "title slug thumbnail genre")
  .populate("friends", "name username avatar lastSeen _id")
  .populate("incomingRequests.from", "_id")   // ⭐ ADD THIS
  .populate("outgoingRequests.to", "_id")     // ⭐ ADD THIS
  .lean(); 


    if (!user) return res.status(404).json({ message: "User not found" });

    // Relationship detection
    let relationship = "none";
    let mutualFriends = [];

    console.log("🔵 VIEWER ID:", viewerId);

const meFull = await User.findById(viewerId);
console.log("🔥 FULL ME FROM DB:", JSON.stringify(meFull, null, 2));

const targetFull = await User.findOne({ username });
console.log("🔥 FULL TARGET USER:", JSON.stringify(targetFull, null, 2));

    if (viewerId) {
  const me = await User.findById(viewerId)
  .select("friends incomingRequests outgoingRequests")
  .populate("incomingRequests.from", "_id")
  .populate("outgoingRequests.to", "_id")
  .lean();


  const targetId = user._id.toString();

  // FRIEND CHECK
  const myFriendIds = (me.friends || []).map(f =>
    f._id?.toString?.() || f.toString()
  );
  if (myFriendIds.includes(targetId)) {
    relationship = "friend";
  }

  // OUTGOING CHECK (you sent request)
  const outgoingIds = (me.outgoingRequests || []).map(r =>
    r.to?._id?.toString?.() || r.to?.toString()
  );
  if (outgoingIds.includes(targetId)) {
    relationship = "outgoing";
  }

  // INCOMING CHECK (they sent request)
  const incomingIds = (me.incomingRequests || []).map(r =>
    r.from?._id?.toString?.() || r.from?.toString()
  );
  if (incomingIds.includes(targetId)) {
    relationship = "incoming";
  }




      // mutual friends: intersection of viewer's friends and target's friends
      mutualFriends = (user.friends || [])
        .filter(f => myFriendIds.includes(f._id.toString()))
        .map(f => ({ _id: f._id.toString(), username: f.username, avatar: f.avatar, name: f.name }));
    }

    // Online check (2 minute threshold)
    const lastSeen = user.lastSeen ? new Date(user.lastSeen) : null;
    const online = lastSeen ? (Date.now() - lastSeen.getTime() < 2 * 60 * 1000) : false;

    return res.json({
      success: true,
      user: {
        _id: user._id.toString(),
        username: user.username,
        name: user.name,
        avatar: user.avatar,
        bio: user.bio,
        social: user.social,
        favorites: user.favorites || [],
        mutualFriends,
        relationship,
        online,
        lastSeen: user.lastSeen || null,
      },
    });
  } catch (err) {
    console.error("🔥 PUBLIC PROFILE ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
