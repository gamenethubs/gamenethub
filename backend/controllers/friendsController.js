/****************************************
 * backend/controllers/friendsController.js
 *****************************************/
// import User from "../models/User.js";

// /**************************************
//  * Helper → format minimal user object
//  **************************************/
// const miniUser = (u) => ({
//   id: u._id.toString(),
//   name: u.name,
//   username: u.username,
//   avatar: u.avatar,
// });

// /**
//  * Helper: emit to both default namespace AND presence namespace (if available)
//  * Keeps payload delivery consistent whether client listens on "/" or "/presence".
//  */
// const emitToUser = (io, userId, event, payload) => {
//   try {
//     // emit on default namespace / root
//     io.to(userId.toString()).emit(event, payload);
//   } catch (e) {
//     // ignore
//   }
//   try {
//     // if presence namespace exists, emit there too
//     if (io.of && io.of("/presence")) {
//       io.of("/presence").to(userId.toString()).emit(event, payload);
//     }
//   } catch (e) {
//     // ignore
//   }
// };

// /**************************************
//  * ⭐ SEND FRIEND REQUEST
//  **************************************/
// export const sendRequest = async (req, res) => {
//   try {
//     const fromId = req.user._id.toString();
//     const { toUserId } = req.body;

//     if (!toUserId)
//       return res.status(400).json({ message: "Missing target user" });

//     if (fromId === toUserId)
//       return res.status(400).json({ message: "You cannot add yourself" });

//     const from = await User.findById(fromId);
//     const to = await User.findById(toUserId);

//     if (!to) return res.status(404).json({ message: "User not found" });

//     // Already friends?
//     if (from.friends.map(String).includes(toUserId))
//       return res.status(400).json({ message: "Already friends" });

//     // Already sent request?
//     if (from.outgoingRequests.find((r) => r.to.toString() === toUserId))
//       return res.status(400).json({ message: "Request already sent" });

//     // Already received → auto-accept
//     if (from.incomingRequests.find((r) => r.from.toString() === toUserId)) {
//       req.body.fromUserId = toUserId;
//       return acceptRequest(req, res);
//     }

//     // Send request
//     from.outgoingRequests.push({ to: toUserId });
//     to.incomingRequests.push({ from: fromId });

//     await from.save();
//     await to.save();

//     // SOCKET EVENT → emit to both namespaces
//     emitToUser(req.io, toUserId, "friend_request_received", {
//       from: miniUser(from),
//     });

//     // NOTIFICATION → emit to both namespaces
//     emitToUser(req.io, toUserId, "notify-user", {
//       id: Date.now(),
//       title: "New Friend Request",
//       text: `${from.username} sent you a friend request.`,
//       slug: "friends",
//       thumbnail: from.avatar,
//       time: new Date().toLocaleTimeString(),
//       seen: false,
//     });

//     res.json({ message: "Friend request sent" });
//   } catch (err) {
//     console.error("SEND FRIEND REQUEST ERROR:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// /**************************************
//  * ⭐ CANCEL SENT REQUEST
//  **************************************/
// export const cancelRequest = async (req, res) => {
//   try {
//     const userId = req.user._id.toString();
//     const { toUserId } = req.body;

//     const user = await User.findById(userId);
//     const target = await User.findById(toUserId);

//     if (!target) return res.status(404).json({ message: "User not found" });

//     user.outgoingRequests = user.outgoingRequests.filter(
//       (r) => r.to.toString() !== toUserId
//     );

//     target.incomingRequests = target.incomingRequests.filter(
//       (r) => r.from.toString() !== userId
//     );

//     await user.save();
//     await target.save();

//     // NOTIFICATION → emit to both namespaces
//     emitToUser(req.io, toUserId, "notify-user", {
//       id: Date.now(),
//       title: "Friend Request Canceled",
//       text: `${user.username} canceled the friend request.`,
//       slug: "friends",
//       thumbnail: user.avatar,
//       time: new Date().toLocaleTimeString(),
//       seen: false,
//     });

//     res.json({ message: "Friend request canceled" });
//   } catch (err) {
//     console.error("CANCEL REQUEST ERROR:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// /**************************************
//  * ⭐ ACCEPT REQUEST
//  **************************************/
// export const acceptRequest = async (req, res) => {
//   try {
//     const userId = req.user._id.toString();
//     const { fromUserId } = req.body;

//     const user = await User.findById(userId);
//     const from = await User.findById(fromUserId);

//     if (!from) return res.status(404).json({ message: "User not found" });

//     const incoming = user.incomingRequests.find(
//       (r) => r.from.toString() === fromUserId
//     );

//     if (!incoming)
//       return res.status(400).json({ message: "No incoming request found" });

//     // Remove pending requests
//     user.incomingRequests = user.incomingRequests.filter(
//       (r) => r.from.toString() !== fromUserId
//     );
//     from.outgoingRequests = from.outgoingRequests.filter(
//       (r) => r.to.toString() !== userId
//     );

//     // Mutual friendship
//     if (!user.friends.map(String).includes(fromUserId))
//       user.friends.push(fromUserId);
//     if (!from.friends.map(String).includes(userId)) from.friends.push(userId);

//     await user.save();
//     await from.save();

//     // SOCKET notify sender → emit on both namespaces
//     emitToUser(req.io, fromUserId, "friend_request_accepted", {
//       user: miniUser(user),
//     });

//     // NOTIFICATION → emit on both namespaces
//     emitToUser(req.io, fromUserId, "notify-user", {
//       id: Date.now(),
//       title: "Friend Request Accepted",
//       text: `${user.username} accepted your friend request.`,
//       slug: "friends",
//       thumbnail: user.avatar,
//       time: new Date().toLocaleTimeString(),
//       seen: false,
//     });

//     res.json({ message: "Friend request accepted" });
//   } catch (err) {
//     console.error("ACCEPT REQUEST ERROR:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// /**************************************
//  * ⭐ REJECT REQUEST
//  **************************************/
// export const rejectRequest = async (req, res) => {
//   try {
//     const userId = req.user._id.toString();
//     const { fromUserId } = req.body;

//     const user = await User.findById(userId);

//     user.incomingRequests = user.incomingRequests.filter(
//       (r) => r.from.toString() !== fromUserId
//     );

//     const from = await User.findById(fromUserId);
//     if (from) {
//       from.outgoingRequests = from.outgoingRequests.filter(
//         (r) => r.to.toString() !== userId
//       );
//       await from.save();
//     }

//     await user.save();

//     // NOTIFICATION → emit to both namespaces
//     emitToUser(req.io, fromUserId, "notify-user", {
//       id: Date.now(),
//       title: "Friend Request Rejected",
//       text: `${user.username} rejected your friend request.`,
//       slug: "friends",
//       thumbnail: user.avatar,
//       time: new Date().toLocaleTimeString(),
//       seen: false,
//     });

//     res.json({ message: "Friend request rejected" });
//   } catch (err) {
//     console.error("REJECT REQUEST ERROR:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// /**************************************
//  * ⭐ REMOVE FRIEND
//  **************************************/
// export const removeFriend = async (req, res) => {
//   try {
//     const userId = req.user._id.toString();
//     const { friendId } = req.body;

//     const user = await User.findById(userId);
//     const friend = await User.findById(friendId);

//     if (!friend) return res.status(404).json({ message: "User not found" });

//     user.friends = user.friends.filter((f) => f.toString() !== friendId);
//     friend.friends = friend.friends.filter(
//       (f) => f.toString() !== userId
//     );

//     await user.save();
//     await friend.save();

//     // NOTIFICATION → emit to both namespaces
//     emitToUser(req.io, friendId, "notify-user", {
//       id: Date.now(),
//       title: "Friend Removed",
//       text: `${user.username} removed you from friends.`,
//       slug: "friends",
//       thumbnail: user.avatar,
//       time: new Date().toLocaleTimeString(),
//       seen: false,
//     });

//     res.json({ message: "Friend removed" });
//   } catch (err) {
//     console.error("REMOVE FRIEND ERROR:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// /**************************************
//  * ⭐ GET MY FRIENDS LIST (online/offline)
//  **************************************/
// export const getFriends = async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id).populate(
//       "friends",
//       "name username avatar lastSeen"
//     );

//     const now = Date.now();
//     const online = [];
//     const offline = [];

//     user.friends.forEach((f) => {
//       const last = f.lastSeen ? new Date(f.lastSeen).getTime() : 0;
//       const isOnline = now - last < 2 * 60 * 1000; // 2 min threshold

//       if (isOnline) online.push(miniUser(f));
//       else offline.push(miniUser(f));
//     });

//     res.json({ online, offline });
//   } catch (err) {
//     console.error("GET FRIENDS ERROR:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };


// /****************************************
//  * backend/controllers/friendsController.js
//  *****************************************/
// import User from "../models/User.js";

// /**************************************
//  * Helper → format minimal user object
//  **************************************/
// const miniUser = (u) => ({
//   id: u._id.toString(),
//   name: u.name,
//   username: u.username,
//   avatar: u.avatar,
// });

// /**
//  * Helper: emit to both default namespace AND presence namespace (if available)
//  * Keeps payload delivery consistent whether client listens on "/" or "/presence".
//  */
// const emitToUser = (io, userId, event, payload) => {
//   try {
//     // emit on default namespace / root
//     io.to(userId.toString()).emit(event, payload);
//   } catch (e) {
//     // ignore
//   }
//   try {
//     // if presence namespace exists, emit there too
//     if (io.of && io.of("/presence")) {
//       io.of("/presence").to(userId.toString()).emit(event, payload);
//     }
//   } catch (e) {
//     // ignore
//   }
// };

// /**************************************
//  * ⭐ SEND FRIEND REQUEST
//  **************************************/
// export const sendRequest = async (req, res) => {
//   try {
//     const fromId = req.user._id.toString();
//     const { toUserId } = req.body;

//     if (!toUserId)
//       return res.status(400).json({ message: "Missing target user" });

//     if (fromId === toUserId)
//       return res.status(400).json({ message: "You cannot add yourself" });

//     const from = await User.findById(fromId);
//     const to = await User.findById(toUserId);

//     if (!to) return res.status(404).json({ message: "User not found" });

//     // Already friends?
//     if (from.friends.map(String).includes(toUserId))
//       return res.status(400).json({ message: "Already friends" });

//     // Already sent request?
//     if (from.outgoingRequests.find((r) => r.to.toString() === toUserId))
//       return res.status(400).json({ message: "Request already sent" });

//     // Already received → auto-accept
//     if (from.incomingRequests.find((r) => r.from.toString() === toUserId)) {
//       // convert into accept flow: current user (from) accepts incoming from toUserId
//       req.body.fromUserId = toUserId;
//       return acceptRequest(req, res);
//     }

//     // Send request
//     from.outgoingRequests.push({ to: toUserId });
//     to.incomingRequests.push({ from: fromId });

//     await from.save();
//     await to.save();

//     // SOCKET EVENT → emit to both namespaces (inform target)
//     emitToUser(req.io, toUserId, "friend_request_received", {
//       from: miniUser(from),
//     });

//     // Relationship update (so UIs that show "add/sent/incoming/friend" refresh)
//     emitToUser(req.io, toUserId, "relationship_update", { userId: fromId });
//     emitToUser(req.io, fromId, "relationship_update", { userId: toUserId });

//     // NOTIFICATION → emit to both namespaces (actor = 'from')
//     emitToUser(req.io, toUserId, "notify-user", {
//       id: Date.now(),
//       title: "New Friend Request",
//       text: `${from.username} sent you a friend request.`,
//       slug: "friends",
//       thumbnail: from.avatar || null,
//       username: from.username,        // actor username
//       userId: from._id.toString(),    // actor id
//       time: new Date().toLocaleTimeString(),
//       seen: false,
//     });

//     res.json({ message: "Friend request sent" });
//   } catch (err) {
//     console.error("SEND FRIEND REQUEST ERROR:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// /**************************************
//  * ⭐ CANCEL SENT REQUEST
//  **************************************/
// export const cancelRequest = async (req, res) => {
//   try {
//     const userId = req.user._id.toString();
//     const { toUserId } = req.body;

//     const user = await User.findById(userId);
//     const target = await User.findById(toUserId);

//     if (!target) return res.status(404).json({ message: "User not found" });

//     user.outgoingRequests = user.outgoingRequests.filter(
//       (r) => r.to.toString() !== toUserId
//     );

//     target.incomingRequests = target.incomingRequests.filter(
//       (r) => r.from.toString() !== userId
//     );

//     await user.save();
//     await target.save();

//     // Relationship update so UIs refresh
//     emitToUser(req.io, toUserId, "relationship_update", { userId });
//     emitToUser(req.io, userId, "relationship_update", { userId: toUserId });

//     // NOTIFICATION → emit to both namespaces (actor = 'user')
//     emitToUser(req.io, toUserId, "notify-user", {
//       id: Date.now(),
//       title: "Friend Request Canceled",
//       text: `${user.username} canceled the friend request.`,
//       slug: "friends",
//       thumbnail: user.avatar || null,
//       username: user.username,
//       userId: user._id.toString(),
//       time: new Date().toLocaleTimeString(),
//       seen: false,
//     });

//     res.json({ message: "Friend request canceled" });
//   } catch (err) {
//     console.error("CANCEL REQUEST ERROR:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// /**************************************
//  * ⭐ ACCEPT REQUEST
//  **************************************/
// export const acceptRequest = async (req, res) => {
//   try {
//     const userId = req.user._id.toString(); // the recipient who is accepting
//     const { fromUserId } = req.body;

//     const user = await User.findById(userId);
//     const from = await User.findById(fromUserId);

//     if (!from) return res.status(404).json({ message: "User not found" });

//     const incoming = user.incomingRequests.find(
//       (r) => r.from.toString() === fromUserId
//     );

//     if (!incoming)
//       return res.status(400).json({ message: "No incoming request found" });

//     // Remove pending requests
//     user.incomingRequests = user.incomingRequests.filter(
//       (r) => r.from.toString() !== fromUserId
//     );
//     from.outgoingRequests = from.outgoingRequests.filter(
//       (r) => r.to.toString() !== userId
//     );

//     // Mutual friendship
//     if (!user.friends.map(String).includes(fromUserId))
//       user.friends.push(fromUserId);
//     if (!from.friends.map(String).includes(userId)) from.friends.push(userId);

//     await user.save();
//     await from.save();

//     // SOCKET notify sender → emit on both namespaces
//     emitToUser(req.io, fromUserId, "friend_request_accepted", {
//       user: miniUser(user),
//     });

//     // Relationship update for both parties
//     emitToUser(req.io, fromUserId, "relationship_update", { userId: userId });
//     emitToUser(req.io, userId, "relationship_update", { userId: fromUserId });

//     // FRIENDS UPDATED (help mutual friends UI refresh)
//     emitToUser(req.io, fromUserId, "friends_updated", {});
//     emitToUser(req.io, userId, "friends_updated", {});

//     // NOTIFICATION → emit on both namespaces (actor = 'user' who accepted)
//     emitToUser(req.io, fromUserId, "notify-user", {
//       id: Date.now(),
//       title: "Friend Request Accepted",
//       text: `${user.username} accepted your friend request.`,
//       slug: "friends",
//       thumbnail: user.avatar || null,
//       username: user.username,
//       userId: user._id.toString(),
//       time: new Date().toLocaleTimeString(),
//       seen: false,
//     });

//     res.json({ message: "Friend request accepted" });
//   } catch (err) {
//     console.error("ACCEPT REQUEST ERROR:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// /**************************************
//  * ⭐ REJECT REQUEST
//  **************************************/
// export const rejectRequest = async (req, res) => {
//   try {
//     const userId = req.user._id.toString(); // the recipient who is rejecting
//     const { fromUserId } = req.body;

//     const user = await User.findById(userId);

//     user.incomingRequests = user.incomingRequests.filter(
//       (r) => r.from.toString() !== fromUserId
//     );

//     const from = await User.findById(fromUserId);
//     if (from) {
//       from.outgoingRequests = from.outgoingRequests.filter(
//         (r) => r.to.toString() !== userId
//       );
//       await from.save();
//     }

//     await user.save();

//     // Relationship update so UIs refresh
//     emitToUser(req.io, fromUserId, "relationship_update", { userId });
//     emitToUser(req.io, userId, "relationship_update", { userId: fromUserId });

//     // NOTIFICATION → emit to both namespaces (actor = 'user' who rejected)
//     emitToUser(req.io, fromUserId, "notify-user", {
//       id: Date.now(),
//       title: "Friend Request Rejected",
//       text: `${user.username} rejected your friend request.`,
//       slug: "friends",
//       thumbnail: user.avatar || null,
//       username: user.username,
//       userId: user._id.toString(),
//       time: new Date().toLocaleTimeString(),
//       seen: false,
//     });

//     res.json({ message: "Friend request rejected" });
//   } catch (err) {
//     console.error("REJECT REQUEST ERROR:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// /**************************************
//  * ⭐ REMOVE FRIEND
//  **************************************/
// export const removeFriend = async (req, res) => {
//   try {
//     const userId = req.user._id.toString();
//     const { friendId } = req.body;

//     const user = await User.findById(userId);
//     const friend = await User.findById(friendId);

//     if (!friend) return res.status(404).json({ message: "User not found" });

//     user.friends = user.friends.filter((f) => f.toString() !== friendId);
//     friend.friends = friend.friends.filter((f) => f.toString() !== userId);

//     await user.save();
//     await friend.save();

//     // Relationship update for both parties
//     emitToUser(req.io, friendId, "relationship_update", { userId });
//     emitToUser(req.io, userId, "relationship_update", { userId: friendId });

//     // FRIENDS UPDATED so mutual friends UI refreshes
//     emitToUser(req.io, friendId, "friends_updated", {});
//     emitToUser(req.io, userId, "friends_updated", {});

//     // NOTIFICATION → emit to both namespaces (actor = 'user' who removed)
//     emitToUser(req.io, friendId, "notify-user", {
//       id: Date.now(),
//       title: "Friend Removed",
//       text: `${user.username} removed you from friends.`,
//       slug: "friends",
//       thumbnail: user.avatar || null,
//       username: user.username,
//       userId: user._id.toString(),
//       time: new Date().toLocaleTimeString(),
//       seen: false,
//     });

//     res.json({ message: "Friend removed" });
//   } catch (err) {
//     console.error("REMOVE FRIEND ERROR:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// /**************************************
//  * ⭐ GET MY FRIENDS LIST (online/offline)
//  **************************************/
// export const getFriends = async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id).populate(
//       "friends",
//       "name username avatar lastSeen"
//     );

//     const now = Date.now();
//     const online = [];
//     const offline = [];

//     user.friends.forEach((f) => {
//       const last = f.lastSeen ? new Date(f.lastSeen).getTime() : 0;
//       const isOnline = now - last < 2 * 60 * 1000; // 2 min threshold

//       if (isOnline) online.push(miniUser(f));
//       else offline.push(miniUser(f));
//     });

//     res.json({ online, offline });
//   } catch (err) {
//     console.error("GET FRIENDS ERROR:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

/****************************************
 * backend/controllers/friendsController.js
 *****************************************/
import User from "../models/User.js";
import mongoose, { Types } from "mongoose";

/**************************************
 * Helper → format minimal user object
 **************************************/
const miniUser = (u) => ({
    id: u._id.toString(),
    name: u.name,
    username: u.username,
    avatar: u.avatar,
});

/**
 * Helper: emit to both default namespace AND presence namespace (if available)
 */
const emitToUser = (io, userId, event, payload) => {
    try {
        // emit on default namespace / root
        io.to(userId.toString()).emit(event, payload);
    } catch (e) {
        // ignore
    }
    try {
        // if presence namespace exists, emit there too
        if (io.of && io.of("/presence")) {
            io.of("/presence").to(userId.toString()).emit(event, payload);
        }
    } catch (e) {
        // ignore
    }
};

/**************************************
 * ⭐ SEND FRIEND REQUEST (With Inline Auto-Accept)
 **************************************/
export const sendRequest = async (req, res) => {
    try {
        const fromId = req.user._id.toString();
        const { toUserId } = req.body;

        if (!toUserId)
            return res.status(400).json({ message: "Missing target user" });

        if (fromId === toUserId)
            return res.status(400).json({ message: "You cannot add yourself" });

        const from = await User.findById(fromId);
        const to = await User.findById(toUserId);

        if (!to) return res.status(404).json({ message: "User not found" });

        // Already friends?
        if (from.friends.map(String).includes(toUserId))
            return res.status(400).json({ message: "Already friends" });

        // Already sent request?
        if (from.outgoingRequests.find((r) => r.to.toString() === toUserId))
            return res.status(400).json({ message: "Request already sent" });

        
        // -------------------------------------------------------------------
        // 🚨 AUTO-ACCEPT LOGIC (INLINED FIX)
        // Check if 'to' user has already sent a request to 'from' user.
        // We use 'to.incomingRequests' because 'to' is the original sender (fromUserId)
        // when the request was sent earlier.
       // Check if 'to' user already sent a request to 'from' user
const existingIncomingReq = to.incomingRequests.find(
    (r) => r.from.toString() === fromId
);

if (existingIncomingReq) {
    // 1. Remove pending requests from both sides
    to.incomingRequests = to.incomingRequests.filter(
        (r) => r.from.toString() !== fromId
    );
    from.outgoingRequests = from.outgoingRequests.filter(
        (r) => r.to.toString() !== toUserId
    );

    // 2. Add both as friends
    if (!from.friends.map(String).includes(toUserId)) {
        from.friends.push(new Types.ObjectId(toUserId));
    }
    if (!to.friends.map(String).includes(fromId)) {
        to.friends.push(new Types.ObjectId(fromId));
    }

    await from.save();
    await to.save();

    // Notify the original sender
    emitToUser(req.io, toUserId, "friend_request_accepted", { user: miniUser(from) });

    // Sync relationship
    emitToUser(req.io, toUserId, "relationship_update", { userId: fromId });
    emitToUser(req.io, fromId, "relationship_update", { userId: toUserId });

    emitToUser(req.io, toUserId, "friends_updated", {});
    emitToUser(req.io, fromId, "friends_updated", {});

            // NOTIFICATION (for original sender 'toUser')
            emitToUser(req.io, toUserId, "notify-user", {
                id: Date.now(),
                title: "Friend Request Accepted",
                text: `${from.username} accepted your friend request.`,
                slug: "friends",
                thumbnail: from.avatar || null,
                username: from.username,
                userId: from._id.toString(),
                time: new Date().toLocaleTimeString(),
                seen: false,
            });

            // Return success for auto-accept
            return res.json({ message: "Request accepted automatically" });
        }
        // -------------------------------------------------------------------


        // Send request (Original Logic, only runs if auto-accept didn't happen)
        from.outgoingRequests.push({ to: new Types.ObjectId(toUserId) });
        to.incomingRequests.push({ from: new Types.ObjectId(fromId) });

        await from.save();
        await to.save();

        // SOCKET EVENT → emit to both namespaces (inform target)
        emitToUser(req.io, toUserId, "friend_request_received", {
            from: miniUser(from),
        });

        // Relationship update (so UIs that show "add/sent/incoming/friend" refresh)
        emitToUser(req.io, toUserId, "relationship_update", { userId: fromId });
        emitToUser(req.io, fromId, "relationship_update", { userId: toUserId });

        // NOTIFICATION → emit to both namespaces (actor = 'from')
        emitToUser(req.io, toUserId, "notify-user", {
            id: Date.now(),
            title: "New Friend Request",
            text: `${from.username} sent you a friend request.`,
            slug: "friends",
            thumbnail: from.avatar || null,
            username: from.username,
            userId: from._id.toString(),
            time: new Date().toLocaleTimeString(),
            seen: false,
        });

        res.json({ message: "Friend request sent" });
    } catch (err) {
        console.error("SEND FRIEND REQUEST ERROR:", err);
        // Important: Use stack trace during debugging to see the exact line
        res.status(500).json({ message: "Server error" }); 
    }
};

/**************************************
 * ⭐ CANCEL SENT REQUEST
 **************************************/
export const cancelRequest = async (req, res) => {
    try {
        const userId = req.user._id.toString();
        const { toUserId } = req.body;

        const user = await User.findById(userId);
        const target = await User.findById(toUserId);

        if (!target) return res.status(404).json({ message: "User not found" });

        // Use Types.ObjectId for consistency when filtering (though .toString() works too)
        user.outgoingRequests = user.outgoingRequests.filter(
            (r) => r.to.toString() !== toUserId
        );

        target.incomingRequests = target.incomingRequests.filter(
            (r) => r.from.toString() !== userId
        );

        await user.save();
        await target.save();

        // Relationship update so UIs refresh
        emitToUser(req.io, toUserId, "relationship_update", { userId });
        emitToUser(req.io, userId, "relationship_update", { userId: toUserId });

        // NOTIFICATION → emit to both namespaces (actor = 'user')
        emitToUser(req.io, toUserId, "notify-user", {
            id: Date.now(),
            title: "Friend Request Canceled",
            text: `${user.username} canceled the friend request.`,
            slug: "friends",
            thumbnail: user.avatar || null,
            username: user.username,
            userId: user._id.toString(),
            time: new Date().toLocaleTimeString(),
            seen: false,
        });

        res.json({ message: "Friend request canceled" });
    } catch (err) {
        console.error("CANCEL REQUEST ERROR:", err);
        res.status(500).json({ message: "Server error" });
    }
};

/**************************************
 * ⭐ ACCEPT REQUEST
 **************************************/
export const acceptRequest = async (req, res) => {
    try {
        const userId = req.user._id.toString(); // the recipient who is accepting
        const { fromUserId } = req.body;

        const user = await User.findById(userId);
        const from = await User.findById(fromUserId);

        if (!from) return res.status(404).json({ message: "User not found" });

        const incoming = user.incomingRequests.find(
            (r) => r.from.toString() === fromUserId
        );

        if (!incoming)
            return res.status(400).json({ message: "No incoming request found" });

        // Remove pending requests
        user.incomingRequests = user.incomingRequests.filter(
            (r) => r.from.toString() !== fromUserId
        );
        from.outgoingRequests = from.outgoingRequests.filter(
            (r) => r.to.toString() !== userId
        );

        // Mutual friendship (Using Types.ObjectId as discussed)
        if (!user.friends.map(String).includes(fromUserId))
            user.friends.push(new Types.ObjectId(fromUserId));
        if (!from.friends.map(String).includes(userId)) 
            from.friends.push(new Types.ObjectId(userId));

        await user.save();
        await from.save();

        // SOCKET notify sender → emit on both namespaces
        emitToUser(req.io, fromUserId, "friend_request_accepted", {
            user: miniUser(user),
        });

        // Relationship update for both parties
        emitToUser(req.io, fromUserId, "relationship_update", { userId: userId });
        emitToUser(req.io, userId, "relationship_update", { userId: fromUserId });

        // FRIENDS UPDATED (help mutual friends UI refresh)
        emitToUser(req.io, fromUserId, "friends_updated", {});
        emitToUser(req.io, userId, "friends_updated", {});

        // NOTIFICATION → emit on both namespaces (actor = 'user' who accepted)
        emitToUser(req.io, fromUserId, "notify-user", {
            id: Date.now(),
            title: "Friend Request Accepted",
            text: `${user.username} accepted your friend request.`,
            slug: "friends",
            thumbnail: user.avatar || null,
            username: user.username,
            userId: user._id.toString(),
            time: new Date().toLocaleTimeString(),
            seen: false,
        });

        res.json({ message: "Friend request accepted" });
    } catch (err) {
        console.error("ACCEPT REQUEST ERROR:", err);
        res.status(500).json({ message: "Server error" });
    }
};

/**************************************
 * ⭐ REJECT REQUEST
 **************************************/
export const rejectRequest = async (req, res) => {
    try {
        const userId = req.user._id.toString(); // the recipient who is rejecting
        const { fromUserId } = req.body;

        const user = await User.findById(userId);

        user.incomingRequests = user.incomingRequests.filter(
            (r) => r.from.toString() !== fromUserId
        );

        const from = await User.findById(fromUserId);
        if (from) {
            from.outgoingRequests = from.outgoingRequests.filter(
                (r) => r.to.toString() !== userId
            );
            await from.save();
        }

        await user.save();

        // Relationship update so UIs refresh
        emitToUser(req.io, fromUserId, "relationship_update", { userId });
        emitToUser(req.io, userId, "relationship_update", { userId: fromUserId });

        // NOTIFICATION → emit to both namespaces (actor = 'user' who rejected)
        emitToUser(req.io, fromUserId, "notify-user", {
            id: Date.now(),
            title: "Friend Request Rejected",
            text: `${user.username} rejected your friend request.`,
            slug: "friends",
            thumbnail: user.avatar || null,
            username: user.username,
            userId: user._id.toString(),
            time: new Date().toLocaleTimeString(),
            seen: false,
        });

        res.json({ message: "Friend request rejected" });
    } catch (err) {
        console.error("REJECT REQUEST ERROR:", err);
        res.status(500).json({ message: "Server error" });
    }
};

/**************************************
 * ⭐ REMOVE FRIEND
 **************************************/
export const removeFriend = async (req, res) => {
    try {
        const userId = req.user._id.toString();
        const { friendId } = req.body;

        const user = await User.findById(userId);
        const friend = await User.findById(friendId);

        if (!friend) return res.status(404).json({ message: "User not found" });

        user.friends = user.friends.filter((f) => f.toString() !== friendId);
        friend.friends = friend.friends.filter((f) => f.toString() !== userId);

        await user.save();
        await friend.save();

        // Relationship update for both parties
        emitToUser(req.io, friendId, "relationship_update", { userId });
        emitToUser(req.io, userId, "relationship_update", { userId: friendId });

        // FRIENDS UPDATED so mutual friends UI refreshes
        emitToUser(req.io, friendId, "friends_updated", {});
        emitToUser(req.io, userId, "friends_updated", {});

        // NOTIFICATION → emit to both namespaces (actor = 'user' who removed)
        emitToUser(req.io, friendId, "notify-user", {
            id: Date.now(),
            title: "Friend Removed",
            text: `${user.username} removed you from friends.`,
            slug: "friends",
            thumbnail: user.avatar || null,
            username: user.username,
            userId: user._id.toString(),
            time: new Date().toLocaleTimeString(),
            seen: false,
        });

        res.json({ message: "Friend removed" });
    } catch (err) {
        console.error("REMOVE FRIEND ERROR:", err);
        res.status(500).json({ message: "Server error" });
    }
};

/**************************************
 * ⭐ GET MY FRIENDS LIST (online/offline)
 **************************************/
export const getFriends = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate(
            "friends",
            "name username avatar lastSeen"
        );

        const now = Date.now();
        const online = [];
        const offline = [];

        user.friends.forEach((f) => {
            // Check if f exists before accessing properties (safety)
            if (f) {
                const last = f.lastSeen ? new Date(f.lastSeen).getTime() : 0;
                const isOnline = now - last < 2 * 60 * 1000; // 2 min threshold

                if (isOnline) online.push(miniUser(f));
                else offline.push(miniUser(f));
            }
        });

        res.json({ online, offline });
    } catch (err) {
        console.error("GET FRIENDS ERROR:", err);
        res.status(500).json({ message: "Server error" });
    }
};

