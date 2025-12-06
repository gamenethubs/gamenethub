// src/components/FriendsModal.jsx
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api"; // your axios instance
import ShareProfileModal from "./ShareProfileModal";
import { useSocket } from "../context/SocketContext"; // <-- use global socketRef

/**
 * FriendsModal (upgraded)
 *
 * Props:
 * - visible (bool)
 * - onClose (fn)
 * - user (object) current user from auth context
 *
 * Notes:
 * - Relies on backend routes you already have:
 *    GET  /api/friends/list           -> { online: [], offline: [] }
 *    GET  /api/users/me               -> { user: ... } (to get incoming/outgoing/friends easily)
 *    GET  /api/users/search?q=...
 *    POST /api/friends/request        -> { message }
 *    POST /api/friends/request/cancel
 *    POST /api/friends/request/accept
 *    POST /api/friends/request/reject
 *    POST /api/friends/remove
 *
 * - SocketContext (global) provides a socketRef (React ref) via useSocket()
 * - We attach listeners to socketRef.current when available — but we DON'T create or disconnect the socket here.
 * - We also listen to window CustomEvents (emitted by SocketProvider) as a safe fallback.
 */

export default function FriendsModal({ visible, onClose, user }) {
  const navigate = useNavigate();

  const [online, setOnline] = useState([]);
  const [offline, setOffline] = useState([]);
  const [loadingFriends, setLoadingFriends] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchPage, setSearchPage] = useState(1);

  // track incoming/outgoing for current user (ids)
  const [incomingIds, setIncomingIds] = useState(new Set());
  const [outgoingIds, setOutgoingIds] = useState(new Set());
  const [friendIds, setFriendIds] = useState(new Set());

  // optimistic sent requests set (for immediate UI)
  const [optimisticSent, setOptimisticSent] = useState(new Set());

  const [showShare, setShowShare] = useState(false);

  // use global socketRef from context (value is a ref)
  const socketRef = useSocket(); // this is a React ref object (provided by SocketProvider)
  // note: socketRef.current may be null initially

  const containerRef = useRef(null);

  // used to prevent setting state after unmount
  const isMountedRef = useRef(true);

  // used to abort previous search requests
  const searchAbortRef = useRef(null);

  const PAGE_SIZE = 6;

  // Helper to normalize id to string (safe)
  const norm = (id) => (id === undefined || id === null ? id : id.toString());

  // ---------- Helpers to refresh server state ----------
  const loadFriendsList = async () => {
    // Do not clear the current lists here to avoid UI flicker.
    // Show loading indicator but keep previous lists until fresh data arrives.
    setLoadingFriends(true);
    try {
      const res = await API.get("/friends/list");
      if (!isMountedRef.current) return;
      setOnline(res.data.online || []);
      setOffline(res.data.offline || []);
    } catch (err) {
      console.error("Failed to load friends list:", err);
      // Do not aggressively clear lists on error — keep previous to avoid flicker.
    } finally {
      if (isMountedRef.current) setLoadingFriends(false);
    }
  };

  const loadMyRequestsAndFriends = async () => {
    // GET /api/users/me returns req.user from backend (without password)
    try {
      const res = await API.get("/users/me");
      if (!isMountedRef.current) return;
      const me = res.data?.user || res.data;
      // normalize arrays to sets of strings
      const inc = new Set(
        (me?.incomingRequests || [])
          .map((r) => norm(r.from || r.fromId || r.from?._id))
          .filter(Boolean)
      );
      const out = new Set(
        (me?.outgoingRequests || [])
          .map((r) => norm(r.to || r.toId || r.to?._id))
          .filter(Boolean)
      );
      const frs = new Set((me?.friends || []).map((f) => norm(f)).filter(Boolean));

      setIncomingIds(inc);
      setOutgoingIds(out);
      setFriendIds(frs);
    } catch (err) {
      console.error("Failed to load my profile data:", err);
      // keep previous sets instead of clearing — safer UX
    }
  };

  // Reset modal-local state when opened or when user changes.
  useEffect(() => {
    if (!visible) return;

    // Clear search + optimistic to avoid showing previous user's data after logout/login.
    setSearchTerm("");
    setSearchResults([]);
    setSearchPage(1);
    setSearchLoading(false);
    setOptimisticSent(new Set());

    // Reset request/friend tracking and reload fresh state.
    setIncomingIds(new Set());
    setOutgoingIds(new Set());
    setFriendIds(new Set());

    loadFriendsList();
    loadMyRequestsAndFriends();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, user?._id]);

  // Keep isMountedRef updated
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // --------- Realtime: listen to global socketRef.current and window events ----------
  // --------- Realtime: listen to global socketRef.current and window events ----------
useEffect(() => {
  if (!visible) return;

    const main = socketRef?.current?.main || null;
  const presence = socketRef?.current?.presence || null;



  const onFriendRequestReceived = (payload) => {
    const data = payload?.detail ?? payload;
    const from = data?.from || data;
    const id = norm(from?._id || from?.id || from);

    if (!id) return;
    setIncomingIds((prev) => new Set([...prev, id]));
  };

  const onFriendRequestAccepted = (payload) => {
    const data = payload?.detail ?? payload;
    const u = data?.user || data;
    const id = norm(u?._id || u?.id || u);

    if (!id) return;

    setOutgoingIds((prev) => new Set([...prev].filter((x) => x !== id)));
    setFriendIds((prev) => new Set([...prev, id]));

    loadFriendsList();
  };

  const onFriendRequestRejected = (payload) => {
    const data = payload?.detail ?? payload;
    const id = norm(data?.fromId || data?.id || data);

    if (!id) return;

    setOutgoingIds((prev) => new Set([...prev].filter((x) => x !== id)));
    setOptimisticSent((prev) => new Set([...prev].filter((x) => x !== id)));
  };

  const onFriendOnline = () => loadFriendsList();
  const onFriendOffline = () => loadFriendsList();

  // MAIN SOCKET LISTENERS
  if (main) {
    main.on("friend_request_received", onFriendRequestReceived);
    main.on("friend_request_accepted", onFriendRequestAccepted);
    main.on("friend_request_rejected", onFriendRequestRejected);
  }

  // PRESENCE SOCKET LISTENERS
  if (presence) {
    presence.on("friend_online", onFriendOnline);
    presence.on("friend_offline", onFriendOffline);
  }

  // Window fallback
  window.addEventListener("friend_request_received", onFriendRequestReceived);
  window.addEventListener("friend_request_accepted", onFriendRequestAccepted);
  window.addEventListener("friend_request_rejected", onFriendRequestRejected);
  window.addEventListener("friend-online", onFriendOnline);
  window.addEventListener("friend-offline", onFriendOffline);

  return () => {
    if (main) {
      main.off("friend_request_received", onFriendRequestReceived);
      main.off("friend_request_accepted", onFriendRequestAccepted);
      main.off("friend_request_rejected", onFriendRequestRejected);
    }

    if (presence) {
      presence.off("friend_online", onFriendOnline);
      presence.off("friend_offline", onFriendOffline);
    }

    window.removeEventListener("friend_request_received", onFriendRequestReceived);
    window.removeEventListener("friend_request_accepted", onFriendRequestAccepted);
    window.removeEventListener("friend_request_rejected", onFriendRequestRejected);
    window.removeEventListener("friend-online", onFriendOnline);
    window.removeEventListener("friend-offline", onFriendOffline);
  };
}, [visible, socketRef, user?._id]);



  // ---------- Search users (debounced) ----------
  useEffect(() => {
    if (!visible) return;
    setSearchPage(1);

    // Clear previous abort if any
    if (searchAbortRef.current) {
      try {
        searchAbortRef.current.abort();
      } catch (e) {
        // ignore
      }
      searchAbortRef.current = null;
    }

    if (!searchTerm || searchTerm.trim().length === 0) {
      setSearchResults([]);
      setSearchLoading(false);
      return;
    }

    setSearchLoading(true);
    const controller = new AbortController();
    searchAbortRef.current = controller;

    const t = setTimeout(async () => {
      try {
        const q = encodeURIComponent(searchTerm.trim());
        // Include signal to abort if needed
        const res = await API.get(`/users/search?q=${q}`, { signal: controller.signal });

        if (!isMountedRef.current) return;
        const list = (res.data || []).filter((u) => {
          // exclude logged-in user by _id OR username (extra safety)
          if (!u) return false;
          if (user?._id && u._id && u._id.toString() === user._id.toString()) return false;
          if (user?.username && u.username && u.username === user.username) return false;
          return true;
        });

        // Mark each result with computed "status" to simplify UI:
        // "friend" | "incoming" | "outgoing" | "none"
        const annotated = list.map((u) => {
          const id = norm(u._id);
          let status = "none";
          if (id && friendIds.has(id)) status = "friend";
          else if (id && incomingIds.has(id)) status = "incoming";
          else if (id && outgoingIds.has(id)) status = "outgoing";
          // optimisticSent overrides outgoing for immediate feedback
          if (id && optimisticSent.has(id)) status = "outgoing";
          return { ...u, _status: status };
        });

        setSearchResults(annotated);
      } catch (err) {
        if (err?.name === "CanceledError" || err?.name === "AbortError") {
          // aborted — ignore
        } else {
          console.error("Search failed", err);
          if (isMountedRef.current) setSearchResults([]);
        }
      } finally {
        if (isMountedRef.current) setSearchLoading(false);
      }
    }, 320);

    return () => {
      clearTimeout(t);
      // abort pending fetch
      try {
        controller.abort();
      } catch (e) {
        // ignore
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, incomingIds, outgoingIds, friendIds, optimisticSent, visible]);

  // ---------- Action handlers to call backend and update UI ----------

  const optimisticAddOutgoing = (id) => {
    const sid = norm(id);
    setOptimisticSent((s) => new Set(Array.from(s).concat([sid])));
    setOutgoingIds((s) => new Set(Array.from(s).concat([sid])));
  };

  const removeOptimistic = (id) => {
    const sid = norm(id);
    setOptimisticSent((s) => {
      const clone = new Set(Array.from(s));
      clone.delete(sid);
      return clone;
    });
    setOutgoingIds((s) => {
      const clone = new Set(Array.from(s));
      clone.delete(sid);
      return clone;
    });
  };

  const handleSendRequest = async (toUserId) => {
    if (!toUserId) return;
    const sid = norm(toUserId);
    try {
      optimisticAddOutgoing(sid);
      await API.post("/friends/request", { toUserId: sid });
      // backend will notify receiver via socket — keep outgoing
    } catch (err) {
      console.error("Send request failed:", err);
      removeOptimistic(sid);
      alert(err.response?.data?.message || "Failed to send friend request");
    }
  };

  const handleCancelRequest = async (toUserId) => {
    if (!toUserId) return;
    const sid = norm(toUserId);
    try {
      // optimistic remove
      removeOptimistic(sid);
      await API.post("/friends/request/cancel", { toUserId: sid });
      // server removes outgoing/incoming on both sides
      // refresh my requests to be safe
      await loadMyRequestsAndFriends();
    } catch (err) {
      console.error("Cancel request failed:", err);
      // revert by reloading my requests
      await loadMyRequestsAndFriends();
      alert(err.response?.data?.message || "Failed to cancel request");
    }
  };

  const handleAcceptRequest = async (fromUserId) => {
    if (!fromUserId) return;
    const sid = norm(fromUserId);
    try {
      await API.post("/friends/request/accept", { fromUserId: sid });
      // update sets
      setIncomingIds((s) => {
        const clone = new Set(Array.from(s));
        clone.delete(sid);
        return clone;
      });
      setFriendIds((s) => {
        const clone = new Set(Array.from(s));
        clone.add(sid);
        return clone;
      });
      // Refresh friends lists
      await loadFriendsList();
    } catch (err) {
      console.error("Accept request failed:", err);
      alert(err.response?.data?.message || "Failed to accept request");
    }
  };

  const handleRejectRequest = async (fromUserId) => {
    if (!fromUserId) return;
    const sid = norm(fromUserId);
    try {
      await API.post("/friends/request/reject", { fromUserId: sid });
      setIncomingIds((s) => {
        const clone = new Set(Array.from(s));
        clone.delete(sid);
        return clone;
      });
      // Also ensure outgoing removed on their side; server handles that
    } catch (err) {
      console.error("Reject request failed:", err);
      alert(err.response?.data?.message || "Failed to reject request");
    }
  };

  const handleRemoveFriend = async (friendId) => {
    if (!friendId) return;
    const sid = norm(friendId);
    try {
      await API.post("/friends/remove", { friendId: sid });
      setFriendIds((s) => {
        const clone = new Set(Array.from(s));
        clone.delete(sid);
        return clone;
      });
      // Refresh displayed friends
      await loadFriendsList();
    } catch (err) {
      console.error("Remove friend failed:", err);
      alert(err.response?.data?.message || "Failed to remove friend");
    }
  };

  // ---------- UI helpers ----------
  const searchActive = searchTerm && searchTerm.trim().length > 0;
  const pagedResults = searchResults.slice(0, searchPage * PAGE_SIZE);

  if (!visible) return null;

  return (
    <div style={styles.backdrop}>
      <div style={styles.modal} ref={containerRef} role="dialog" aria-modal>
        <div style={styles.header}>
          <div style={{ fontWeight: 800, fontSize: 18, color: "#e6f0ff" }}>Friends</div>

          <div style={{ display: "flex", gap: 8 }}>
            <button
              style={styles.iconBtn}
              onClick={() => setShowShare(true)}
              title="Share profile"
            >
              ↗
            </button>

            <button
              style={styles.closeBtn}
              onClick={() => onClose && onClose()}
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          {/* Search */}
          <div style={styles.searchRow}>
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search new or existing friends"
              style={styles.searchInput}
            />
            {searchTerm ? (
              <button onClick={() => setSearchTerm("")} style={styles.clearBtn} aria-label="Clear search">
                ✕
              </button>
            ) : null}
          </div>

          {/* CTA */}
          <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
            <button
              style={styles.playBtn}
              onClick={() => {
                window.location.href = "/online-multiplayer";
              }}
            >
              🕹️ Play with friends
            </button>

            <button style={styles.shareBtn} onClick={() => setShowShare(true)}>
              ↗ Share profile
            </button>
          </div>

          {/* Results area */}
          <div style={{ marginTop: 18 }}>
            {searchActive ? (
              <>
                <div style={{ marginBottom: 10, color: "#9fb7d9", fontWeight: 700 }}>Add friends</div>

                {searchLoading ? (
                  <div style={{ color: "#9fb7d9" }}>Searching…</div>
                ) : pagedResults.length === 0 ? (
                  <div style={styles.emptyCard}>No users found.</div>
                ) : (
                  <div style={styles.list}>
                    {pagedResults.map((u) => {
                      const id = norm(u._id);
                      const status = u._status || "none"; // friend | incoming | outgoing | none

                      return (
                        <div key={id || u.username} style={styles.listItem}>
                          <div style={styles.listLeft}>
                            <img
                              src={u.avatar || "/avatars/default.png"}
                              alt={u.username}
                              style={styles.smallAvatar}
                              onError={(e) => (e.currentTarget.src = "/avatars/default.png")}
                              onClick={() => {
  onClose && onClose();
  navigate(`/user/${encodeURIComponent(u.username)}`);
}}
                            />
                            <div>
                              <div
                                style={{ fontWeight: 800, color: "#fff", cursor: "pointer" }}
                                onClick={() => {
  onClose && onClose();
  navigate(`/user/${encodeURIComponent(u.username)}`);
}}
                              >
                                {u.username}
                              </div>
                              <div style={{ fontSize: 12, color: "#9fb7d9" }}>{u.name}</div>
                            </div>
                          </div>

                          <div>
                            {/* Option A: inline actions */}
                            {status === "friend" && (
                              <button
                                style={styles.viewBtn}
                                onClick={() => {
  onClose && onClose();
  navigate(`/user/${encodeURIComponent(u.username)}`);
}}
                              >
                                View
                              </button>
                            )}

                            {status === "incoming" && (
                              <div style={{ display: "flex", gap: 8 }}>
                                <button style={styles.acceptBtn} onClick={() => handleAcceptRequest(id)}>
                                  Accept
                                </button>
                                <button style={styles.rejectBtn} onClick={() => handleRejectRequest(id)}>
                                  Reject
                                </button>
                              </div>
                            )}

                            {status === "outgoing" && (
                              <div style={{ display: "flex", gap: 8 }}>
                                <button style={styles.sentBtn} disabled>
                                  Sent
                                </button>
                                <button style={styles.cancelBtn} onClick={() => handleCancelRequest(id)}>
                                  Cancel
                                </button>
                              </div>
                            )}

                            {status === "none" && (
                              <button style={styles.addBtn} onClick={() => handleSendRequest(id)}>
                                Add
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Show more */}
                {pagedResults.length > 0 && pagedResults.length < searchResults.length && (
                  <div style={{ marginTop: 12, textAlign: "center" }}>
                    <button style={styles.showMoreBtn} onClick={() => setSearchPage((p) => p + 1)}>
                      Show more
                    </button>
                  </div>
                )}
              </>
            ) : (
              <>
                {/* Online friends */}
                <div style={{ marginBottom: 12, color: "#9fb7d9", fontWeight: 700 }}>Online friends</div>

                {loadingFriends ? (
                  <div style={{ color: "#9fb7d9" }}>Loading…</div>
                ) : online.length === 0 ? (
                  <div style={styles.emptyCard}>
                    <div style={{ fontSize: 28 }}>😔</div>
                    <div style={{ marginTop: 8, fontWeight: 800, color: "#fff" }}>Nobody's online</div>
                  </div>
                ) : (
                  <div style={styles.list}>
                    {online.map((f) => (
                      <div key={norm(f.id)} style={styles.friendRow}>
                        <div style={styles.listLeft}>
                          <div style={{ position: "relative" }}>
                            <img
                              src={f.avatar || "/avatars/default.png"}
                              alt={f.username}
                              style={styles.smallAvatar}
                              onError={(e) => (e.currentTarget.src = "/avatars/default.png")}
                             onClick={() => {
  onClose && onClose();
  navigate(`/user/${encodeURIComponent(f.username)}`);
}}
                            />
                            <span style={styles.onlineDot} />
                          </div>
                          <div>
                            <div
                              style={{ fontWeight: 800, color: "#fff", cursor: "pointer" }}
                              onClick={() => {
  onClose && onClose();
  navigate(`/user/${encodeURIComponent(f.username)}`);
}}
                            >
                              {f.username || f.name}
                            </div>
                            <div style={{ fontSize: 12, color: "#9fb7d9" }}>{f.name}</div>
                          </div>
                        </div>

                        <div style={{ display: "flex", gap: 8 }}>
                          <button style={styles.viewProfileBtn} onClick={() => {
  onClose && onClose();
  navigate(`/user/${encodeURIComponent(f.username)}`);
}}
>
                            View
                          </button>
                          <button style={styles.removeFriendBtn} onClick={() => handleRemoveFriend(f.id)}>
                            Unfriend
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Offline friends */}
                <div style={{ marginTop: 18, marginBottom: 12, color: "#9fb7d9", fontWeight: 700 }}>
                  Offline friends {offline.length ? <span style={{ opacity: 0.8, fontWeight: 700 }}> {offline.length}</span> : null}
                </div>

                {offline.length === 0 ? (
                  <div style={styles.emptyCard}>You have no friends yet — start by searching above.</div>
                ) : (
                  <div style={styles.list}>
                    {offline.map((f) => (
                      <div key={norm(f.id)} style={styles.friendRow}>
                        <div style={styles.listLeft}>
                          <img
                            src={f.avatar || "/avatars/default.png"}
                            alt={f.username}
                            style={styles.smallAvatar}
                            onError={(e) => (e.currentTarget.src = "/avatars/default.png")}
                            onClick={() => {
  onClose && onClose();
  navigate(`/user/${encodeURIComponent(f.username)}`);
}}
                          />
                          <div>
                            <div style={{ fontWeight: 800, color: "#fff", cursor: "pointer" }} onClick={() => {
  onClose && onClose();
  navigate(`/user/${encodeURIComponent(f.username)}`);
}}
>
                              {f.username || f.name}
                            </div>
                            <div style={{ fontSize: 12, color: "#9fb7d9" }}>{f.name}</div>
                          </div>
                        </div>

                        <div style={{ display: "flex", gap: 8 }}>
                          <button style={styles.viewProfileBtn} onClick={() => {
  onClose && onClose();
  navigate(`/user/${encodeURIComponent(f.username)}`);
}}
>
    View
                          </button>
                          <button style={styles.removeFriendBtn} onClick={() => handleRemoveFriend(f.id)}>
                            Unfriend
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Share modal */}
      {showShare && <ShareProfileModal visible={showShare} onClose={() => setShowShare(false)} user={user} />}
    </div>
  );
}

/* --------------------- styles ---------------------- */
/* Keep nearly identical to your theme; added a few new button styles */
const styles = {
  backdrop: {
    position: "fixed",
    inset: 0,
    zIndex: 3200,
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    background: "rgba(0,0,0,0.6)",
    paddingTop: "80px",
    paddingLeft: 18,
    paddingRight: 18,
    paddingBottom: 18,
  },
  modal: {
    width: "min(560px, 96vw)",
    maxHeight: "85vh",
    overflowY: "auto",
    background: "#071224",
    borderRadius: 16,
    padding: 20,
    border: "1px solid rgba(255,255,255,0.04)",
    boxShadow: "0 30px 80px rgba(0,0,0,0.45)",
    alignSelf: "flex-start",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  closeBtn: {
    background: "transparent",
    border: "none",
    color: "#9fb7d9",
    fontSize: 18,
    cursor: "pointer",
  },
  iconBtn: {
    background: "transparent",
    border: "none",
    color: "#9fb7d9",
    cursor: "pointer",
    fontSize: 16,
    marginRight: 6,
  },
  searchRow: {
    display: "flex",
    gap: 8,
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    padding: "10px 12px",
    borderRadius: 999,
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.04)",
    color: "#fff",
    outline: "none",
  },
  clearBtn: {
    padding: "8px 10px",
    background: "#2f2f3f",
    borderRadius: 8,
    border: "none",
    color: "#fff",
    cursor: "pointer",
  },

  playBtn: {
    flex: 1,
    padding: "12px 14px",
    borderRadius: 12,
    border: "none",
    fontWeight: 800,
    background: "linear-gradient(90deg,#34d399,#10b981)",
    color: "#052014",
    cursor: "pointer",
  },

  shareBtn: {
    padding: "12px 14px",
    borderRadius: 12,
    border: "none",
    fontWeight: 800,
    background: "#2b2b3a",
    color: "#fff",
    cursor: "pointer",
  },

  emptyCard: {
    padding: 18,
    borderRadius: 12,
    background: "rgba(255,255,255,0.02)",
    color: "#9fb7d9",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 6,
    textAlign: "center",
  },

  list: {
    display: "grid",
    gap: 10,
  },

  listItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 12px",
    borderRadius: 12,
    background: "rgba(255,255,255,0.02)",
  },

  listLeft: {
    display: "flex",
    gap: 10,
    alignItems: "center",
  },

  smallAvatar: {
    width: 44,
    height: 44,
    borderRadius: 10,
    objectFit: "cover",
    background: "#0b1220",
    cursor: "pointer",
  },

  addBtn: {
    padding: "8px 12px",
    borderRadius: 999,
    background: "linear-gradient(90deg,#6366f1,#3b82f6)",
    color: "#fff",
    border: "none",
    fontWeight: 800,
    cursor: "pointer",
  },

  sentBtn: {
    padding: "8px 12px",
    borderRadius: 999,
    background: "#374151",
    color: "#cfe8ff",
    border: "none",
    fontWeight: 700,
  },

  cancelBtn: {
    padding: "8px 10px",
    borderRadius: 8,
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.06)",
    color: "#cfe8ff",
    cursor: "pointer",
    fontWeight: 700,
  },

  acceptBtn: {
    padding: "8px 12px",
    borderRadius: 10,
    background: "#10b981",
    border: "none",
    color: "#052014",
    cursor: "pointer",
    fontWeight: 800,
  },

  rejectBtn: {
    padding: "8px 10px",
    borderRadius: 10,
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.06)",
    color: "#cfe8ff",
    cursor: "pointer",
    fontWeight: 700,
  },

  showMoreBtn: {
    padding: "10px 14px",
    borderRadius: 12,
    background: "rgba(255,255,255,0.03)",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    fontWeight: 800,
  },

  friendRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 12px",
    borderRadius: 12,
    background: "rgba(255,255,255,0.02)",
  },

  onlineDot: {
    position: "absolute",
    right: -6,
    bottom: -6,
    width: 12,
    height: 12,
    borderRadius: 12,
    background: "#34d399",
    border: "2px solid #071224",
    boxShadow: "0 6px 16px rgba(52,211,153,0.14)",
  },

  viewProfileBtn: {
    padding: "8px 12px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.04)",
    background: "transparent",
    color: "#fff",
    fontWeight: 700,
    cursor: "pointer",
  },

  viewBtn: {
    padding: "8px 12px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.04)",
    background: "#2563eb",
    color: "#fff",
    fontWeight: 700,
    cursor: "pointer",
  },

  removeFriendBtn: {
    padding: "8px 10px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.04)",
    background: "transparent",
    color: "#ff7b7b",
    fontWeight: 700,
    cursor: "pointer",
  },
};
