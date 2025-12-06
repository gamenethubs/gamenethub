// backend/controllers/userController.js
import User from "../models/User.js";
import generateUsername from "../utils/generateUsername.js";

/************************************
 * 🔹 GET LOGGED-IN USER PROFILE
 ************************************/
export const getMyProfile = async (req, res) => {
  try {
    return res.json({
      success: true,
      user: req.user, // already without password
    });
  } catch (err) {
    console.error("🔥 GET MY PROFILE ERROR:", err.message);
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

    /************************************
     * UPDATE NAME
     ************************************/
    if (name && name !== user.name) {
      user.name = name;
    }

    /************************************
     * UPDATE USERNAME (UNIQUE)
     ************************************/
    if (username && username !== user.username) {
      const exists = await User.findOne({ username });
      if (exists) {
        return res.status(400).json({
          success: false,
          message: "Username already taken",
        });
      }
      user.username = username.trim().toLowerCase();
    }

    /************************************
     * UPDATE AVATAR
     ************************************/
    if (avatar) {
      user.avatar = avatar; // frontend sends "/avatars/avatar03.png"
    }

    /************************************
     * BIO UPDATE
     ************************************/
    if (bio !== undefined) {
      user.bio = bio;
    }

    /************************************
     * SOCIAL LINKS UPDATE
     ************************************/
    if (social) {
      user.social.instagram = social.instagram || "";
      user.social.twitter = social.twitter || "";
      user.social.linkedin = social.linkedin || "";
    }

    await user.save();

    return res.json({
      success: true,
      message: "Profile updated",
      user,
    });
  } catch (err) {
    console.error("🔥 UPDATE PROFILE ERROR:", err.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/************************************
 * 🔹 SEARCH USERS BY USERNAME
 ************************************/
export const searchUsers = async (req, res) => {
  try {
    const q = req.query.q?.trim().toLowerCase();
    if (!q) return res.json([]);

    const users = await User.find({
      username: { $regex: q, $options: "i" },
    })
      .select("name username avatar")
      .limit(20);

    return res.json(users);
  } catch (err) {
    console.error("🔥 SEARCH USERS ERROR:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
};

/************************************
 * 🔹 GET PUBLIC PROFILE BY USERNAME
 ************************************/
// export const getPublicProfile = async (req, res) => {
//   try {
//     const username = req.params.username.toLowerCase();

//     const user = await User.findOne({ username })
//       .select("-password -email -googleId -favorites -ratedGames");

//     if (!user)
//       return res.status(404).json({ message: "User not found" });

//     return res.json({
//       success: true,
//       user,
//     });
//   } catch (err) {
//     console.error("🔥 PUBLIC PROFILE ERROR:", err.message);
//     return res.status(500).json({ message: "Server error" });
//   }
// };


export const getPublicProfile = async (req, res) => {
  try {
    const viewerId = req.user?._id; // logged-in user (optional)
    const username = (req.params.username || "").toLowerCase();

    // Populate favorites + friends
    const user = await User.findOne({ username })
      .select("-password -email -googleId -ratedGames")
      .populate("favorites", "title slug thumbnail genre")
      .populate("friends", "name username avatar lastSeen");

    if (!user)
      return res.status(404).json({ message: "User not found" });

    // Relationship Status Calculation
    let relationship = "none";

    if (viewerId) {
      const me = await User.findById(viewerId)
        .select("friends incomingRequests outgoingRequests");

      // normalize my friends to strings for reliable comparisons
      const myFriendIds = (me?.friends || []).map((f) => f.toString());

      const targetId = user._id.toString();

      if (myFriendIds.includes(targetId)) {
        relationship = "friend";
      } else if ((me?.outgoingRequests || []).some(r => (r.to || r.toString || "").toString() === targetId)) {
        relationship = "outgoing";
      } else if ((me?.incomingRequests || []).some(r => (r.from || r.fromString || "").toString() === targetId)) {
        relationship = "incoming";
      }
    }

    // Mutual Friends
    let mutualFriends = [];
    if (viewerId) {
      const me = await User.findById(viewerId).select("friends");
      const myFriends = (me?.friends || []).map(id => id.toString());
      // user.friends is populated with friend objects — compare by _id string
      mutualFriends = (user.friends || []).filter(f =>
        myFriends.includes(f._id.toString())
      );
    }

    // Online Status (only if they are your friend)
    let online = false;
    if (user.lastSeen) {
      const diff = Date.now() - new Date(user.lastSeen).getTime();
      // Slightly longer threshold to avoid flapping due to tiny inactivity
      online = diff < 2 * 60 * 1000; // 2 minutes threshold
    }

    return res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        avatar: user.avatar,
        bio: user.bio,
        social: user.social,
        favorites: user.favorites,
        mutualFriends,
        relationship,
        online
      }
    });

  } catch (err) {
    console.error("🔥 PUBLIC PROFILE ERROR:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
};
