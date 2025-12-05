/****************************************
 * backend/controllers/friendsController.js
 *****************************************/
import User from "../models/User.js";

/**************************************
 * Helper → format minimal user object
 **************************************/
const miniUser = (u) => ({
  id: u._id,
  name: u.name,
  username: u.username,
  avatar: u.avatar,
});

/**************************************
 * ⭐ SEND FRIEND REQUEST
 **************************************/
export const sendRequest = async (req, res) => {
  try {
    const fromId = req.user._id;
    const { toUserId } = req.body;

    if (!toUserId)
      return res.status(400).json({ message: "Missing target user" });

    if (fromId.toString() === toUserId) {
      return res.status(400).json({ message: "You cannot add yourself" });
    }

    const from = await User.findById(fromId);
    const to = await User.findById(toUserId);

    if (!to) return res.status(404).json({ message: "User not found" });

    // Already friends?
    if (from.friends.includes(toUserId)) {
      return res.status(400).json({ message: "Already friends" });
    }

    // Already sent request?
    if (from.outgoingRequests.find((r) => r.to.toString() === toUserId)) {
      return res.status(400).json({ message: "Request already sent" });
    }

    // Already received request? → auto-accept
    const incomingFromTarget = from.incomingRequests.find(
      (r) => r.from.toString() === toUserId
    );

    if (incomingFromTarget) {
      // ⭐ FIX: Ensure "fromUserId" exists before auto-accept
      req.body.fromUserId = toUserId;
      return acceptRequest(req, res);
    }

    // Push new requests
    from.outgoingRequests.push({ to: toUserId });
    to.incomingRequests.push({ from: fromId });

    await from.save();
    await to.save();

    // SOCKET EVENT → notify receiver
    req.io.to(toUserId.toString()).emit("friend_request_received", {
      from: miniUser(from),
    });

    res.json({ message: "Friend request sent" });
  } catch (err) {
    console.error("SEND FRIEND REQUEST ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**************************************
 * ⭐ CANCEL SENT REQUEST
 **************************************/
export const cancelRequest = async (req, res) => {
  try {
    const userId = req.user._id;
    const { toUserId } = req.body;

    const user = await User.findById(userId);
    const target = await User.findById(toUserId);

    if (!target) return res.status(404).json({ message: "User not found" });

    user.outgoingRequests = user.outgoingRequests.filter(
      (r) => r.to.toString() !== toUserId
    );

    target.incomingRequests = target.incomingRequests.filter(
      (r) => r.from.toString() !== userId.toString()
    );

    await user.save();
    await target.save();

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
    const userId = req.user._id;
    const { fromUserId } = req.body;

    const user = await User.findById(userId);
    const from = await User.findById(fromUserId);

    if (!from) return res.status(404).json({ message: "User not found" });

    const incoming = user.incomingRequests.find(
      (r) => r.from.toString() === fromUserId
    );

    if (!incoming) {
      return res.status(400).json({ message: "No incoming request found" });
    }

    // Remove pending requests
    user.incomingRequests = user.incomingRequests.filter(
      (r) => r.from.toString() !== fromUserId
    );
    from.outgoingRequests = from.outgoingRequests.filter(
      (r) => r.to.toString() !== userId.toString()
    );

    // Add mutual friendship
    if (!user.friends.includes(fromUserId)) user.friends.push(fromUserId);
    if (!from.friends.includes(userId)) from.friends.push(userId);

    await user.save();
    await from.save();

    // SOCKET notify → accepted
    req.io.to(fromUserId.toString()).emit("friend_request_accepted", {
      user: miniUser(user),
    });

    res.json({ message: "Friend request accepted" });
  } catch (err) {
    console.error("ACCEPT REQUEST ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**************************************
 * ⭐ REJECT REQUEST (with FIX)
 **************************************/
export const rejectRequest = async (req, res) => {
  try {
    const userId = req.user._id;
    const { fromUserId } = req.body;

    const user = await User.findById(userId);

    // remove incoming
    user.incomingRequests = user.incomingRequests.filter(
      (r) => r.from.toString() !== fromUserId
    );

    // ⭐ FIX: remove outgoing request from sender also
    const from = await User.findById(fromUserId);
    if (from) {
      from.outgoingRequests = from.outgoingRequests.filter(
        (r) => r.to.toString() !== userId.toString()
      );
      await from.save();
    }

    await user.save();

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
    const userId = req.user._id;
    const { friendId } = req.body;

    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!friend) return res.status(404).json({ message: "User not found" });

    user.friends = user.friends.filter((f) => f.toString() !== friendId);
    friend.friends = friend.friends.filter(
      (f) => f.toString() !== userId.toString()
    );

    await user.save();
    await friend.save();

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
      const isOnline = f.lastSeen && now - f.lastSeen.getTime() < 60000;

      if (isOnline) online.push(miniUser(f));
      else offline.push(miniUser(f));
    });

    res.json({ online, offline });
  } catch (err) {
    console.error("GET FRIENDS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
