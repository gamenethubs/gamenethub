
// src/pages/PublicProfile.jsx
import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";

const API_BASE = process.env.REACT_APP_API_BASE;

export default function PublicProfile() {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user: me, isAuthenticated } = useAuth();

  const socketRef = useSocket();
  const mainSocket = socketRef?.current?.main || null;
  const presenceSocket = socketRef?.current?.presence || null;

  const mountedRef = useRef(true);

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const norm = (id) => (id ? id.toString() : "");

  // -----------------------------------------
  // Load profile from backend
  // -----------------------------------------
  const loadProfile = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/users/${encodeURIComponent(username)}`);
      const p = res.data?.user;

      if (!mountedRef.current) return;
      // 🛑 LOG 4: Check the incoming relationship status from backend
      console.log("🟢 LOAD_PROFILE: Backend Relationship Status:", p?.relationship);
      setProfile(p ? { ...p, id: p._id } : null);
      // 🛑 LOG 5: Check the relationship status *after* setProfile call
      // NOTE: The actual state change won't reflect immediately here, but it confirms the data went in.
      console.log("🔵 LOAD_PROFILE: New profile data set.");
    } catch (err) {
      console.error("LOAD PROFILE ERROR:", err);
      if (mountedRef.current) setProfile(null);
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  };

  useEffect(() => {
    mountedRef.current = true;
    window.scrollTo(0, 0);
    loadProfile();
    return () => (mountedRef.current = false);
  }, [username]);

  const safeSetProfile = (partial) => {
    setProfile((prev) => (prev ? { ...prev, ...partial } : prev));
  };

  // -----------------------------------------
  // REALTIME SOCKET SYNC (PERFECT)
  // -----------------------------------------
//   useEffect(() => {
//     if (!profile) return;
//     const pid = norm(profile.id);

//     const reload = () => loadProfile();

//     const onRelationshipUpdate = ({ userId }) => {
//       if (norm(userId) === pid) reload();
//     };

//     const onFriendsUpdated = () => reload();

//     // const onFriendRequestReceived = (payload) => {
//     //   const fromId = norm(payload?.from?.id);
//     //   const toId = norm(payload?.toUserId);
//     //   if (toId === pid || fromId === pid) reload();
//     // };
// //     const onFriendRequestReceived = (payload) => {
// //   const fromId = norm(payload?.from?.id);
// //   if (fromId === pid) loadProfile();  // correct condition
// // };
// const onFriendRequestReceived = () => {
//   loadProfile();   // Always reload — relationship may have changed
// };



//     const onFriendRequestAccepted = (payload) => {
//       const id = norm(payload?.user?.id);
//       if (id === pid) reload();
//     };

//     const onFriendRequestRejected = (payload) => {
//       const id = norm(payload?.fromId);
//       if (id === pid) reload();
//     };

//     const onFriendOnline = ({ userId }) => {
//       if (norm(userId) === pid) safeSetProfile({ online: true });
//     };

//     const onFriendOffline = ({ userId }) => {
//       if (norm(userId) === pid) safeSetProfile({ online: false });
//     };

//     // MAIN SOCKET
//     if (mainSocket) {
//       mainSocket.on("relationship_update", onRelationshipUpdate);
//       mainSocket.on("friends_updated", onFriendsUpdated);
//       mainSocket.on("friend_request_received", onFriendRequestReceived);
//       mainSocket.on("friend_request_accepted", onFriendRequestAccepted);
//       mainSocket.on("friend_request_rejected", onFriendRequestRejected);
//     }

//     // PRESENCE SOCKET
//     if (presenceSocket) {
//       presenceSocket.on("friend_online", onFriendOnline);
//       presenceSocket.on("friend_offline", onFriendOffline);

//       presenceSocket.on("friend_request_received", onFriendRequestReceived);
//       presenceSocket.on("friend_request_accepted", onFriendRequestAccepted);
//       presenceSocket.on("friend_request_rejected", onFriendRequestRejected);
//     }

//     return () => {
//       if (mainSocket) {
//         mainSocket.off("relationship_update", onRelationshipUpdate);
//         mainSocket.off("friends_updated", onFriendsUpdated);
//         mainSocket.off("friend_request_received", onFriendRequestReceived);
//         mainSocket.off("friend_request_accepted", onFriendRequestAccepted);
//         mainSocket.off("friend_request_rejected", onFriendRequestRejected);
//       }
//       if (presenceSocket) {
//         presenceSocket.off("friend_online", onFriendOnline);
//         presenceSocket.off("friend_offline", onFriendOffline);
//         presenceSocket.off("friend_request_received", onFriendRequestReceived);
//         presenceSocket.off("friend_request_accepted", onFriendRequestAccepted);
//         presenceSocket.off("friend_request_rejected", onFriendRequestRejected);
//       }
//     };
//   }, [profile, mainSocket, presenceSocket]);

// src/pages/PublicProfile.jsx

// ... (पुराना कोड)

// -----------------------------------------
// REALTIME SOCKET SYNC (FINAL FIX)
// -----------------------------------------
useEffect(() => {
  const reload = async () => {
    try {
      const res = await API.get(`/users/${encodeURIComponent(username)}`);
      const p = res.data?.user;
      if (mountedRef.current) setProfile(p ? { ...p, id: p._id } : null);
    } catch (err) {
      console.error("RELOAD PROFILE ERROR:", err);
    }
  };  
  if (!profile) return;

  const pid = norm(profile.id);

//   const reload = () => loadProfile();

  // --- Handlers ---
  const onRelationshipUpdate = (e) => {
    // e.detail contains the payload, which should have { userId }
    if (norm(e.detail?.userId) === pid) reload();
  };

  const onFriendsUpdated = () => reload();

  const onFriendOnline = (e) => {
    if (norm(e.detail?.userId) === pid) safeSetProfile({ online: true });
  };

  const onFriendOffline = (e) => {
    if (norm(e.detail?.userId) === pid) safeSetProfile({ online: false });
  };

  // The simple reload events (these happen when ANY action occurs)
  const onAnyRelationshipChange = () => reload();


  // ⭐ THE FIX: Listen to Window Custom Events (from SocketContext) ⭐
  
  // CORE SYNC EVENTS (Relationship & Mutual Friends)
  window.addEventListener("relationship_update", onRelationshipUpdate);
  window.addEventListener("friends_updated", onFriendsUpdated);
  
  // PRESENCE EVENTS
  window.addEventListener("friend-online", onFriendOnline);
  window.addEventListener("friend-offline", onFriendOffline);
  
  // FALLBACK FOR REQUESTS (We just need to reload if any friend action occurred)
  window.addEventListener("friend_request_received", onAnyRelationshipChange);
  window.addEventListener("friend_request_accepted", onAnyRelationshipChange);
  window.addEventListener("friend_request_rejected", onAnyRelationshipChange);

  return () => {
    // ⭐ CLEANUP THE WINDOW LISTENERS ⭐
    window.removeEventListener("relationship_update", onRelationshipUpdate);
    window.removeEventListener("friends_updated", onFriendsUpdated);

    window.removeEventListener("friend-online", onFriendOnline);
    window.removeEventListener("friend-offline", onFriendOffline);

    window.removeEventListener("friend_request_received", onAnyRelationshipChange);
    window.removeEventListener("friend_request_accepted", onAnyRelationshipChange);
    window.removeEventListener("friend_request_rejected", onAnyRelationshipChange);
  };
}, [profile, username]); 
// 'profile' dependency is important for initial profile ID


  // -----------------------------------------
  // ACTIONS (Perfect sync)
  // -----------------------------------------
  // src/pages/PublicProfile.jsx

// -----------------------------------------
// ACTIONS (Final Fix for State Sync)
// -----------------------------------------
  const doAction = async (api, optimistic) => {
    setActionLoading(true);
    
    // 1. Optimistic Update (Quick visual feedback)
    if (optimistic) safeSetProfile(optimistic);
    
    try {
      // 2. Perform the API action (Accept, Unfriend, etc.)
      await api();
      
      // 3. Fetch the new data from the server
      await loadProfile();
      
    } catch (err) {
      console.error("DO ACTION ERROR:", err);
      
      await loadProfile();
    }
    
    
    setActionLoading(false);
  };

  // PublicProfile.jsx

  const handleAdd = () => {
    const targetId = profile.id || profile._id;
    console.log("⚠️ ADD FRIEND PAYLOAD:", { toUserId: targetId }); // <<-- NEW LOG
    return doAction(
      () => API.post("/friends/request", { toUserId: targetId }),
      { relationship: "outgoing" }
    );
  };
  const handleCancel = () =>
    doAction(
      () => API.post("/friends/request/cancel", { toUserId: profile.id || profile._id }),
      { relationship: "none" }
    );

  const handleAccept = () =>
    doAction(
      () => API.post("/friends/request/accept", { fromUserId: profile.id || profile._id }),
      { relationship: "friend" }
    );

  const handleReject = () =>
    doAction(
      () => API.post("/friends/request/reject", { fromUserId: profile.id || profile._id }),
      { relationship: "none" }
    );

  const handleUnfriend = () =>
    doAction(
      () => API.post("/friends/remove", { friendId: profile.id || profile._id }),
      { relationship: "none" }
    );

  // STATUS
  const rel = profile?.relationship;
  const isFriend = rel === "friend";
  const isOutgoing = rel === "outgoing";
  const isIncoming = rel === "incoming";
  const isMe = me?.username === profile?.username;

  const renderFriendButton = () => {
    if (!isAuthenticated || isMe) return null;

    if (isFriend)
      return (
        <div style={{ display: "flex", gap: 10 }}>
          <button style={styles.primaryBtn}>Friend ✓</button>
          <button style={styles.unfriendBtn} onClick={handleUnfriend} disabled={actionLoading}>
            Unfriend
          </button>
        </div>
      );

    if (isOutgoing)
      return (
        <div style={{ display: "flex", gap: 10 }}>
          <button style={styles.sentBtn}>Sent</button>
          <button style={styles.cancelBtn} onClick={handleCancel} disabled={actionLoading}>
            Cancel
          </button>
        </div>
      );

    if (isIncoming)
      return (
        <div style={{ display: "flex", gap: 10 }}>
          <button style={styles.acceptBtn} onClick={handleAccept} disabled={actionLoading}>
            Accept
          </button>
          <button style={styles.rejectBtn} onClick={handleReject} disabled={actionLoading}>
            Reject
          </button>
        </div>
      );

    return (
      <button style={styles.addBtn} onClick={handleAdd} disabled={actionLoading}>
        Add Friend
      </button>
    );
  };

  if (loading)
    return (
      <div style={screenCenter}>
        <div style={{ color: "#9fb7d9" }}>Loading profile...</div>
      </div>
    );

  if (!profile)
    return (
      <div style={screenCenter}>
        <div style={{ color: "#ff7b7b" }}>User not found.</div>
      </div>
    );

  // -----------------------------------------
  // UI
  // -----------------------------------------
  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <div style={styles.headerSection}>
          <div style={styles.avatarBox}>
            <img
              src={profile.avatar || "/avatars/default.png"}
              style={styles.avatar}
              alt="avatar"
              onError={(e) => (e.currentTarget.src = "/avatars/default.png")}
            />

            {isFriend && (
              <div style={profile.online ? styles.onlineDot : styles.offlineDot} />
            )}
          </div>

          <div>
            <div style={styles.name}>{profile.name}</div>
            <div style={styles.username}>@{profile.username}</div>
            {profile.bio && <div style={styles.bio}>{profile.bio}</div>}

            <div style={{ marginTop: 12 }}>{renderFriendButton()}</div>
          </div>
        </div>

        {/* Favorites */}
        <h3 style={styles.sectionTitle}>❤️ Favorite Games</h3>

        {!profile.favorites?.length ? (
          <div style={{ color: "#9fb7d9" }}>No favorites.</div>
        ) : (
          <div style={styles.favGrid}>
            {profile.favorites.map((g) => (
              <div key={g._id} style={styles.favCard}>
                <img
                  src={
                    g.thumbnail?.startsWith("/uploads")
                      ? `${API_BASE}${g.thumbnail}`
                      : g.thumbnail
                  }
                  alt={g.title}
                  style={styles.favImg}
                />
                <div style={styles.favInfo}>
                  <div style={styles.favTitle}>{g.title}</div>
                  <div style={styles.favGenre}>{g.genre}</div>
                  <button
                    style={styles.viewBtn}
                    onClick={() => navigate(`/game/${g.slug}`)}
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Mutual Friends */}
        <h3 style={{ ...styles.sectionTitle, marginTop: 28 }}>
          👥 Mutual Friends ({profile.mutualFriends?.length || 0})
        </h3>

        {!profile.mutualFriends?.length ? (
          <div style={{ color: "#9fb7d9" }}>No mutual friends.</div>
        ) : (
          <div style={styles.mutualGrid}>
            {profile.mutualFriends.map((m) => (
              <div
                key={m._id}
                style={styles.mutualCard}
                onClick={() => navigate(`/user/${m.username}`)}
              >
                <img
                  src={m.avatar || "/avatars/default.png"}
                  alt={m.username}
                  style={styles.mutualAvatar}
                />
                <div style={styles.mutualName}>{m.username}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// --- styles remain same as before (unchanged) ---
const styles = {
  wrapper: {
    minHeight: "100vh",
    background: "#0f172a",
    padding: "30px 20px",
    display: "flex",
    justifyContent: "center",
  },

  card: {
    width: "100%",
    maxWidth: 900,
    background: "rgba(17,25,40,0.65)",
    borderRadius: 16,
    padding: 26,
    color: "#e6f0ff",
    border: "1px solid rgba(255,255,255,0.06)",
  },

  headerSection: {
    display: "flex",
    gap: 20,
    marginBottom: 30,
    alignItems: "flex-start",
    flexWrap: "wrap",
  },

  avatarBox: {
    width: 110,
    height: 110,
    position: "relative",
    borderRadius: 14,
    overflow: "hidden",
    background: "#071224",
  },

  avatar: { width: "100%", height: "100%", objectFit: "cover" },

  onlineDot: {
    position: "absolute",
    bottom: -4,
    right: -4,
    width: 16,
    height: 16,
    borderRadius: 20,
    background: "#34d399",
    border: "2px solid #0f172a",
  },

  offlineDot: {
    position: "absolute",
    bottom: -4,
    right: -4,
    width: 16,
    height: 16,
    borderRadius: 20,
    background: "#9ca3af",
    border: "2px solid #0f172a",
  },

  name: { fontSize: 22, fontWeight: 800 },
  username: { marginTop: 2, fontSize: 14, opacity: 0.8 },
  bio: { marginTop: 10, fontSize: 14, maxWidth: 450 },

  sectionTitle: {
    marginTop: 10,
    marginBottom: 10,
    fontWeight: 800,
    fontSize: 18,
  },

  favGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
    gap: 16,
  },

  favCard: {
    background: "#0b1220",
    borderRadius: 10,
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.05)",
  },

  favImgWrap: { height: 120, overflow: "hidden" },
  favImg: { width: "100%", height: "120px", objectFit: "cover" },

  favInfo: { padding: 10 },

  favTitle: {
    fontWeight: 800,
    color: "#fff",
    marginBottom: 4,
    fontSize: 14,
  },

  favGenre: { fontSize: 12, color: "#93c5fd", marginBottom: 8 },

  favBtns: { display: "flex", gap: 8 },

  viewBtn: {
    flex: 1,
    background: "#2563eb",
    border: "none",
    color: "#fff",
    padding: "6px 8px",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 13,
  },

  mutualGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
    gap: 16,
  },

  mutualCard: {
    background: "rgba(255,255,255,0.03)",
    borderRadius: 12,
    padding: 12,
    textAlign: "center",
    cursor: "pointer",
    border: "1px solid rgba(255,255,255,0.06)",
  },

  mutualAvatar: {
    width: 60,
    height: 60,
    borderRadius: 12,
    objectFit: "cover",
    marginBottom: 6,
  },

  mutualName: {
    color: "#e6f0ff",
    fontWeight: 700,
    fontSize: 14,
  },

  addBtn: {
    padding: "10px 16px",
    borderRadius: 10,
    background: "#3b82f6",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    fontWeight: 700,
  },

  sentBtn: {
    padding: "10px 14px",
    borderRadius: 10,
    background: "rgba(255,255,255,0.1)",
    color: "#cfe8ff",
    border: "none",
    fontWeight: 700,
  },

  cancelBtn: {
    padding: "10px 14px",
    borderRadius: 10,
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.15)",
    color: "#fff",
    cursor: "pointer",
  },

  acceptBtn: {
    padding: "10px 14px",
    borderRadius: 10,
    background: "#10b981",
    color: "#052014",
    border: "none",
    cursor: "pointer",
    fontWeight: 800,
  },

  rejectBtn: {
    padding: "10px 14px",
    borderRadius: 10,
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.15)",
    color: "#fff",
    cursor: "pointer",
  },

  primaryBtn: {
    padding: "10px 14px",
    borderRadius: 10,
    background: "#3b82f6",
    border: "none",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 700,
  },

  unfriendBtn: {
    padding: "10px 14px",
    borderRadius: 10,
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.15)",
    color: "#ff7b7b",
    cursor: "pointer",
    fontWeight: 700,
  },
};

const screenCenter = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "#0f172a",
  color: "#fff",
};