// src/pages/PublicProfile.jsx
import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext"; // safe if exported

const API_BASE = process.env.REACT_APP_API_BASE;

export default function PublicProfile() {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user: me, isAuthenticated } = useAuth();

  // FIXED SOCKET EXTRACTION
  const socketRef = useSocket();
  const mainSocket = socketRef?.current?.main || null;
  const presenceSocket = socketRef?.current?.presence || null;

  const mountedRef = useRef(true);

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  /* ------------------------------------
      Fetch Public Profile Data
  ------------------------------------ */
  const loadProfile = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/users/${username}`);
      const p = res.data?.user ?? res.data;

      const normalized = {
        ...p,
        id: p.id || p._id,
      };

      if (!mountedRef.current) return;
      setProfile(normalized);
    } catch (err) {
      console.error("PUBLIC PROFILE ERROR:", err);
      if (mountedRef.current) setProfile(null);
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  };

  useEffect(() => {
    mountedRef.current = true;
    window.scrollTo(0, 0);
    loadProfile();
    return () => {
      mountedRef.current = false;
    };
    // eslint-disable-next-line
  }, [username]);

  const safeSetProfile = (updater) => {
    setProfile((prev) => {
      if (!prev) return prev;
      const next =
        typeof updater === "function" ? updater(prev) : { ...prev, ...updater };
      return next;
    });
  };

  /* ------------------------------------
     Realtime handlers
  ------------------------------------ */
  useEffect(() => {
    if (!profile) return;
    if (!mountedRef.current) return;

    const onFriendRequestAccepted = (payload) => {
      try {
        const userObj =
          payload?.user ?? payload?.acceptedBy ?? payload;
        const id =
          (userObj?.id ||
            userObj?._id ||
            userObj?.toString)?.toString?.() ?? null;

        if (id && id === profile.id?.toString()) {
          loadProfile();
        }
      } catch (e) {
        console.warn("ACCEPT HANDLER ERR", e);
      }
    };

    const onFriendRequestRejected = (payload) => {
      try {
        const fromId =
          payload?.fromId ||
          payload?.from?.id ||
          payload?.from?._id;

        if (fromId && fromId.toString() === profile.id?.toString()) {
          loadProfile();
        }
      } catch (e) {
        console.warn("REJECT HANDLER ERR", e);
      }
    };

    const onFriendRequestReceived = (payload) => {
      try {
        const fromId = payload?.from?.id || payload?.from?._id;
        const toId =
          payload?.to ||
          payload?.toUserId ||
          payload?.targetId ||
          null;

        if (
          me?._id &&
          fromId &&
          me._id.toString() === fromId.toString() &&
          profile.id?.toString() === toId?.toString()
        ) {
          loadProfile();
        }

        if (profile.id && toId && profile.id.toString() === toId.toString()) {
          loadProfile();
        }
      } catch (e) {
        console.warn("RECEIVE HANDLER ERR", e);
      }
    };

    const onFriendOnline = ({ userId } = {}) => {
      try {
        if (!userId) return;
        if (profile.id && userId.toString() === profile.id.toString()) {
          safeSetProfile({ online: true });
        }
      } catch (e) {
        console.warn("FRIEND ONLINE HANDLER ERR", e);
      }
    };

    const onFriendOffline = ({ userId } = {}) => {
      try {
        if (!userId) return;
        if (profile.id && userId.toString() === profile.id.toString()) {
          safeSetProfile({ online: false });
        }
      } catch (e) {
        console.warn("FRIEND OFFLINE HANDLER ERR", e);
      }
    };

    // MAIN SOCKET
    if (mainSocket) {
      mainSocket.on("friend_request_accepted", onFriendRequestAccepted);
      mainSocket.on("friend_request_rejected", onFriendRequestRejected);
      mainSocket.on("friend_request_received", onFriendRequestReceived);
    }

    // PRESENCE SOCKET
    if (presenceSocket) {
      presenceSocket.on("friend_online", onFriendOnline);
      presenceSocket.on("friend_offline", onFriendOffline);
    }

    // WINDOW FALLBACK
    const winAccepted = (e) => onFriendRequestAccepted(e?.detail || {});
    const winRejected = (e) => onFriendRequestRejected(e?.detail || {});
    const winReceived = (e) => onFriendRequestReceived(e?.detail || {});
    const winOnline = (e) => onFriendOnline(e?.detail || {});
    const winOffline = (e) => onFriendOffline(e?.detail || {});

    window.addEventListener("friend_request_accepted", winAccepted);
    window.addEventListener("friend_request_rejected", winRejected);
    window.addEventListener("friend_request_received", winReceived);
    window.addEventListener("friend-online", winOnline);
    window.addEventListener("friend-offline", winOffline);

    return () => {
      if (mainSocket) {
        mainSocket.off("friend_request_accepted", onFriendRequestAccepted);
        mainSocket.off("friend_request_rejected", onFriendRequestRejected);
        mainSocket.off("friend_request_received", onFriendRequestReceived);
      }

      if (presenceSocket) {
        presenceSocket.off("friend_online", onFriendOnline);
        presenceSocket.off("friend_offline", onFriendOffline);
      }

      window.removeEventListener("friend_request_accepted", winAccepted);
      window.removeEventListener("friend_request_rejected", winRejected);
      window.removeEventListener("friend_request_received", winReceived);
      window.removeEventListener("friend-online", winOnline);
      window.removeEventListener("friend-offline", winOffline);
    };
    // eslint-disable-next-line
  }, [profile?.id, me?._id]);

  /* ------------------------------------
      Action Handlers 
  ------------------------------------ */
  const handleAdd = async () => {
    setActionLoading(true);
    try {
      await API.post("/friends/request", { toUserId: profile.id });
      await loadProfile();
    } catch (e) {
      console.error(e);
    }
    setActionLoading(false);
  };

  const handleCancel = async () => {
    setActionLoading(true);
    try {
      await API.post("/friends/request/cancel", { toUserId: profile.id });
      await loadProfile();
    } catch (e) {
      console.error(e);
    }
    setActionLoading(false);
  };

  const handleAccept = async () => {
    setActionLoading(true);
    try {
      await API.post("/friends/request/accept", {
        fromUserId: profile.id,
      });
      await loadProfile();
    } catch (e) {
      console.error(e);
    }
    setActionLoading(false);
  };

  const handleReject = async () => {
    setActionLoading(true);
    try {
      await API.post("/friends/request/reject", {
        fromUserId: profile.id,
      });
      await loadProfile();
    } catch (e) {
      console.error(e);
    }
    setActionLoading(false);
  };

  const handleUnfriend = async () => {
    setActionLoading(true);
    try {
      await API.post("/friends/remove", { friendId: profile.id });
      await loadProfile();
    } catch (e) {
      console.error(e);
    }
    setActionLoading(false);
  };

  const relationship = profile?.relationship;
  const isFriend = relationship === "friend";
  const isOutgoing = relationship === "outgoing";
  const isIncoming = relationship === "incoming";
  const isMe = me?.username === profile?.username;

  const renderFriendButton = () => {
    if (!isAuthenticated || isMe) return null;

    if (isFriend) {
      return (
        <div style={{ display: "flex", gap: 10 }}>
          <button style={styles.primaryBtn}>Friend ✓</button>

          <button
            style={styles.unfriendBtn}
            onClick={handleUnfriend}
            disabled={actionLoading}
          >
            Unfriend
          </button>
        </div>
      );
    }

    if (isOutgoing) {
      return (
        <div style={{ display: "flex", gap: 10 }}>
          <button style={styles.sentBtn}>Sent</button>
          <button
            style={styles.cancelBtn}
            onClick={handleCancel}
            disabled={actionLoading}
          >
            Cancel
          </button>
        </div>
      );
    }

    if (isIncoming) {
      return (
        <div style={{ display: "flex", gap: 10 }}>
          <button
            style={styles.acceptBtn}
            onClick={handleAccept}
            disabled={actionLoading}
          >
            Accept
          </button>

          <button
            style={styles.rejectBtn}
            onClick={handleReject}
            disabled={actionLoading}
          >
            Reject
          </button>
        </div>
      );
    }

    return (
      <button
        style={styles.addBtn}
        onClick={handleAdd}
        disabled={actionLoading}
      >
        Add Friend
      </button>
    );
  };

  if (loading) {
    return (
      <div style={screenCenter}>
        <div style={{ color: "#9fb7d9" }}>Loading profile...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div style={screenCenter}>
        <div style={{ color: "#ff7b7b" }}>User not found.</div>
      </div>
    );
  }

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
            {profile.relationship === "friend" && (
              <div
                style={profile.online ? styles.onlineDot : styles.offlineDot}
              />
            )}
          </div>

          <div>
            <div style={styles.name}>{profile.name}</div>
            <div style={styles.username}>@{profile.username}</div>

            {profile.bio && <div style={styles.bio}>{profile.bio}</div>}

            <div style={{ marginTop: 12 }}>{renderFriendButton()}</div>
          </div>
        </div>

        {/* Favorite Games */}
        <h3 style={styles.sectionTitle}>❤️ Favorite Games</h3>

        {!profile.favorites || profile.favorites.length === 0 ? (
          <div style={{ color: "#9fb7d9" }}>No favorites.</div>
        ) : (
          <div style={styles.favGrid} className="fav-grid">
            {profile.favorites.map((g) => (
              <div key={g._id} style={styles.favCard}>
                <div style={styles.favImgWrap}>
                  <img
                    src={
                      g.thumbnail?.startsWith("/uploads")
                        ? `${API_BASE}${g.thumbnail}`
                        : g.thumbnail
                    }
                    alt={g.title}
                    style={styles.favImg}
                  />
                </div>

                <div style={styles.favInfo}>
                  <div style={styles.favTitle}>{g.title}</div>
                  <div style={styles.favGenre}>{g.genre}</div>

                  <div style={styles.favBtns}>
                    <button
                      onClick={() => navigate(`/game/${g.slug}`)}
                      style={styles.viewBtn}
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Mutual Friends */}
        <h3 style={{ ...styles.sectionTitle, marginTop: 28 }}>
          👥 Mutual Friends ({profile.mutualFriends?.length || 0})
        </h3>

        {!profile.mutualFriends || profile.mutualFriends.length === 0 ? (
          <div style={{ color: "#9fb7d9" }}>No mutual friends.</div>
        ) : (
          <div style={styles.mutualGrid} className="mutual-grid">
            {profile.mutualFriends.map((m) => (
              <div
                key={m._id || m.id} // FIXED
                style={styles.mutualCard}
                onClick={() => navigate(`/user/${m.username}`)}
              >
                <img
                  src={m.avatar || "/avatars/default.png"}
                  style={styles.mutualAvatar}
                  alt={m.username}
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

/* original styles unchanged */

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
