
// src/components/FriendsModal.jsx
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import ShareProfileModal from "./ShareProfileModal";
import { useSocket } from "../context/SocketContext";

export default function FriendsModal({ visible, onClose, user }) {
  const navigate = useNavigate();

  const [online, setOnline] = useState([]);
  const [offline, setOffline] = useState([]);
  const [loadingFriends, setLoadingFriends] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchPage, setSearchPage] = useState(1);

  const [incomingIds, setIncomingIds] = useState(new Set());
  const [outgoingIds, setOutgoingIds] = useState(new Set());
  const [friendIds, setFriendIds] = useState(new Set());

  const [optimisticSent, setOptimisticSent] = useState(new Set());
  const [showShare, setShowShare] = useState(false);

  const socketRef = useSocket();

  const containerRef = useRef(null);
  const isMountedRef = useRef(true);
  const searchAbortRef = useRef(null);

  const PAGE_SIZE = 6;
  const norm = (id) => (id === undefined || id === null ? id : id.toString());
  const extractId = (obj) =>
  norm(
    obj?.id ||
    obj?._id ||
    obj?.from?.id ||
    obj?.from?._id ||
    obj?.fromId ||
    obj?.user?.id ||
    obj?.user?._id ||
    obj?.to?.id ||
    obj?.to?._id ||
    obj?.toId
  );


  const loadFriendsList = async () => {
    setLoadingFriends(true);
    try {
      const res = await API.get("/friends/list");
      if (!isMountedRef.current) return;
      setOnline(res.data.online || []);
      setOffline(res.data.offline || []);
    } catch (err) {
      console.error("Failed to load friends list:", err);
    } finally {
      if (isMountedRef.current) setLoadingFriends(false);
    }
  };

  const loadMyRequestsAndFriends = async () => {
    try {
      const res = await API.get("/users/me");
      if (!isMountedRef.current) return;
      const me = res.data?.user || res.data;

      // const inc = new Set(
      //   (me?.incomingRequests || []).map((r) => norm(r.from || r.fromId || r.from?._id)).filter(Boolean)
      // );
      const inc = new Set(
  (me?.incomingRequests || []).map((r) =>
    norm(
      r.fromId ||
      r.from?._id ||
      r.from?.id
    )
  ).filter(Boolean)
);

      const out = new Set(
        (me?.outgoingRequests || []).map((r) => norm(r.to || r.toId || r.to?._id)).filter(Boolean)
      );
      const frs = new Set((me?.friends || []).map((f) => norm(f)).filter(Boolean));

      setIncomingIds(inc);
      setOutgoingIds(out);
      setFriendIds(frs);
    } catch (err) {
      console.error("Failed to load my profile data:", err);
    }
  };

  useEffect(() => {
    if (!visible) return;

    setSearchTerm("");
    setSearchResults([]);
    setSearchPage(1);
    setSearchLoading(false);
    setOptimisticSent(new Set());
    setIncomingIds(new Set());
    setOutgoingIds(new Set());
    setFriendIds(new Set());

    loadFriendsList();
    loadMyRequestsAndFriends();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, user?._id]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Realtime listeners
//   useEffect(() => {
//     if (!visible) return;

//     const main = socketRef?.current?.main || null;
//     const presence = socketRef?.current?.presence || null;

//     const onFriendRequestReceived = (payload) => {
//       const data = payload?.detail ?? payload;
//       const from = data?.from || data;
//       const id = norm(from?._id || from?.id || from);
//       if (!id) return;

//       setIncomingIds((prev) => {
//         const clone = new Set(Array.from(prev));
//         clone.add(id);
//         return clone;
//       });
//     };

//     const onFriendRequestAccepted = (payload) => {
//       const data = payload?.detail ?? payload;
//       const u = data?.user || data;
//       const id = norm(u?._id || u?.id || u);
//       if (!id) return;

//       setOutgoingIds((prev) => {
//         const clone = new Set(Array.from(prev));
//         clone.delete(id);
//         return clone;
//       });
//       setFriendIds((prev) => {
//         const clone = new Set(Array.from(prev));
//         clone.add(id);
//         return clone;
//       });

//       // Keep lists correct
//       loadFriendsList();
//       loadMyRequestsAndFriends();
//       // Also remove optimistic
//       setOptimisticSent((s) => {
//         const clone = new Set(Array.from(s));
//         clone.delete(id);
//         return clone;
//       });
//     };

//     const onFriendRequestRejected = (payload) => {
//       const data = payload?.detail ?? payload;
//       const id = norm(data?.fromId || data?.id || data);
//       if (!id) return;

//       setOutgoingIds((prev) => {
//         const clone = new Set(Array.from(prev));
//         clone.delete(id);
//         return clone;
//       });
//       setOptimisticSent((prev) => {
//         const clone = new Set(Array.from(prev));
//         clone.delete(id);
//         return clone;
//       });

//       loadMyRequestsAndFriends();
//     };

//     const onRelationshipUpdate = (payload) => {
//       // relationship might have changed — refresh sets & friends lists
//       try {
//         loadMyRequestsAndFriends();
//         loadFriendsList();
//       } catch (e) {
//         console.warn("REL UPDATE", e);
//       }
//     };

//     const onFriendsUpdated = () => {
//       loadFriendsList();
//       loadMyRequestsAndFriends();
//     };

//     const onFriendOnline = () => loadFriendsList();
//     const onFriendOffline = () => loadFriendsList();

//     if (main) {
//       main.on("friend_request_received", onFriendRequestReceived);
//       main.on("friend_request_accepted", onFriendRequestAccepted);
//       main.on("friend_request_rejected", onFriendRequestRejected);
//       main.on("relationship_update", onRelationshipUpdate);
//       main.on("friends_updated", onFriendsUpdated);
//     }

//     if (presence) {
//       presence.on("friend_online", onFriendOnline);
//       presence.on("friend_offline", onFriendOffline);

//       // presence also mirrors friend_request events
//       presence.on("friend_request_received", onFriendRequestReceived);
//       presence.on("friend_request_accepted", onFriendRequestAccepted);
//       presence.on("friend_request_rejected", onFriendRequestRejected);
//     }

//     // window fallback
//     window.addEventListener("friend_request_received", onFriendRequestReceived);
//     window.addEventListener("friend_request_accepted", onFriendRequestAccepted);
//     window.addEventListener("friend_request_rejected", onFriendRequestRejected);
//     window.addEventListener("relationship_update", onRelationshipUpdate);
//     window.addEventListener("friends_updated", onFriendsUpdated);
//     window.addEventListener("friend-online", onFriendOnline);
//     window.addEventListener("friend-offline", onFriendOffline);

//     return () => {
//       if (main) {
//         main.off("friend_request_received", onFriendRequestReceived);
//         main.off("friend_request_accepted", onFriendRequestAccepted);
//         main.off("friend_request_rejected", onFriendRequestRejected);
//         main.off("relationship_update", onRelationshipUpdate);
//         main.off("friends_updated", onFriendsUpdated);
//       }
//       if (presence) {
//         presence.off("friend_online", onFriendOnline);
//         presence.off("friend_offline", onFriendOffline);
//         presence.off("friend_request_received", onFriendRequestReceived);
//         presence.off("friend_request_accepted", onFriendRequestAccepted);
//         presence.off("friend_request_rejected", onFriendRequestRejected);
//       }

//       window.removeEventListener("friend_request_received", onFriendRequestReceived);
//       window.removeEventListener("friend_request_accepted", onFriendRequestAccepted);
//       window.removeEventListener("friend_request_rejected", onFriendRequestRejected);
//       window.removeEventListener("relationship_update", onRelationshipUpdate);
//       window.removeEventListener("friends_updated", onFriendsUpdated);
//       window.removeEventListener("friend-online", onFriendOnline);
//       window.removeEventListener("friend-offline", onFriendOffline);
//     };
//   }, [visible, socketRef, user?._id]);
// Realtime listeners
// useEffect(() => {
//   if (!visible) return;

//   const main = socketRef?.current?.main || null;
//   const presence = socketRef?.current?.presence || null;

// //   const onFriendRequestReceived = (payload) => {
// //     console.log("🔵 FR Received:", payload);

// //     const data = payload?.detail ?? payload;
// //     const from = data?.from;
// //     const id = norm(from?.id);

// //     if (!id) return;

// //     setIncomingIds((prev) => new Set([...prev, id]));
// //   };
// const onFriendRequestReceived = (payload) => {
//   console.log("🔵 FR Received:", payload);

//   const from = payload?.from;
//   const id = norm(from?.id); // ✔ backend sends {id}

//   if (!id) return;

//   setIncomingIds(prev => new Set([...prev, id]));
// };


// //   const onFriendRequestAccepted = (payload) => {
// //     console.log("🟢 FR Accepted:", payload);

// //     const data = payload?.detail ?? payload;
// //     const user = data?.user;
// //     const id = norm(user?.id);

// //     if (!id) return;

// //     setOutgoingIds((prev) => {
// //       const next = new Set(prev);
// //       next.delete(id);
// //       return next;
// //     });

// //     setFriendIds((prev) => new Set([...prev, id]));

// //     loadFriendsList();
// //     loadMyRequestsAndFriends();
// //   };
// const onFriendRequestAccepted = (payload) => {
//   console.log("🟢 FR Accepted:", payload);

//   const user = payload?.user;  // miniUser(user)
//   const id = norm(user?.id);   // ✔ backend sends {id}

//   if (!id) return;

//   setOutgoingIds(prev => {
//     const next = new Set(prev);
//     next.delete(id);
//     return next;
//   });

//   setFriendIds(prev => new Set([...prev, id]));
  
//   loadFriendsList();
//   loadMyRequestsAndFriends();
// };

// //   const onFriendRequestRejected = (payload) => {
// //     console.log("🔴 FR Rejected:", payload);

// //     const data = payload?.detail ?? payload;
// //     const id = norm(data?.fromId);

// //     if (!id) return;
// //     setOutgoingIds((prev) => {
// //       const next = new Set(prev);
// //       next.delete(id);
// //       return next;
// //     });
// //   };
// const onFriendRequestRejected = (payload) => {
//   console.log("🔴 FR Rejected:", payload);

//   const id = norm(payload?.fromId); // ✔ backend sends fromId

//   if (!id) return;

//   setOutgoingIds(prev => {
//     const next = new Set(prev);
//     next.delete(id);
//     return next;
//   });
// };


//   const onRelationshipUpdate = () => {
//     console.log("🟠 Relationship update");
//     loadFriendsList();
//     loadMyRequestsAndFriends();
//   };

//   const onFriendsUpdated = () => {
//     console.log("🟣 Friends Updated");
//     loadFriendsList();
//     loadMyRequestsAndFriends();
//   };

//   const onFriendOnline = () => loadFriendsList();
//   const onFriendOffline = () => loadFriendsList();

//   if (main) {
//     main.on("friend_request_received", onFriendRequestReceived);
//     main.on("friend_request_accepted", onFriendRequestAccepted);
//     main.on("friend_request_rejected", onFriendRequestRejected);
//     main.on("relationship_update", onRelationshipUpdate);
//     main.on("friends_updated", onFriendsUpdated);
//   }

//   if (presence) {
//     presence.on("friend_online", onFriendOnline);
//     presence.on("friend_offline", onFriendOffline);

//     presence.on("friend_request_received", onFriendRequestReceived);
//     presence.on("friend_request_accepted", onFriendRequestAccepted);
//     presence.on("friend_request_rejected", onFriendRequestRejected);
//   }

//   return () => {
//     if (main) {
//       main.off("friend_request_received", onFriendRequestReceived);
//       main.off("friend_request_accepted", onFriendRequestAccepted);
//       main.off("friend_request_rejected", onFriendRequestRejected);
//       main.off("relationship_update", onRelationshipUpdate);
//       main.off("friends_updated", onFriendsUpdated);
//     }
//     if (presence) {
//       presence.off("friend_online", onFriendOnline);
//       presence.off("friend_offline", onFriendOffline);
//       presence.off("friend_request_received", onFriendRequestReceived);
//       presence.off("friend_request_accepted", onFriendRequestAccepted);
//       presence.off("friend_request_rejected", onFriendRequestRejected);
//     }
//   };
// }, [visible, socketRef, user?._id]);

// src/components/FriendsModal.jsx

// ... (पुराना कोड)

// Realtime listeners (FIXED: Use window listeners)
useEffect(() => {
  if (!visible) return;

  const norm = (id) => (id === undefined || id === null ? id : id.toString());

  // ----------------------------------------------------
  // HANDLERS (Adjusted to get payload from e.detail)
  // ----------------------------------------------------

  // This handler is complex because it updates local state (incomingIds, etc.)
  // src/components/FriendsModal.jsx

// FriendsModal.jsx (Inside the Realtime listeners useEffect)

// src/components/FriendsModal.jsx (Inside the Realtime listeners useEffect)

const onFriendRequestReceived = (e) => {
    // 🛑 LOG 1: Check the RAW Event and its structure
    console.log("🚨 FR_RECEIVED RAW EVENT:", e);
    
    const payload = e.detail || e; // Get payload from custom event
    const from = payload?.from;
    
    // 1. Check if 'from' is a mini-user object and get its ID
    // const id = norm(from?.id || from?._id); 
    const id = extractId(from);

    if (!id) {
        // 🛑 LOG 2: If ID is missing, we need to know why
        console.warn("❌ FR Received: ID missing in payload:", payload);
        return;
    }

    setIncomingIds(prev => new Set([...prev, id]));
    loadFriendsList(); 
    
    // 🛑 LOG 3: Confirm which ID was successfully added
    console.log(`✅ FR Received: ID ${id} added to IncomingIds.`);
};



const onFriendRequestAccepted = (e) => {
  console.log("🟢 FR Accepted:", e);
  
  const payload = e.detail || e;
  const user = payload?.user; 
//   const id = norm(user?.id || user?._id); 
const id = extractId(user);


  if (!id) {
    console.warn("FR Accepted: ID missing in payload:", payload);
    return;
  }

  setOutgoingIds(prev => {
    const next = new Set(prev);
    next.delete(id);
    return next;
  });

  setFriendIds(prev => new Set([...prev, id]));
  
  loadFriendsList();
  loadMyRequestsAndFriends();
};

const onFriendRequestRejected = (e) => {
  console.log("🔴 FR Rejected:", e);

  const payload = e.detail || e;
  // Rejected event usually sends a simple fromId or id
//   const id = norm(payload?.fromId || payload?.id); 
const id = extractId(payload.fromId || payload);



  if (!id) {
    console.warn("FR Rejected: ID missing in payload:", payload);
    return;
  }

  setOutgoingIds(prev => {
    const next = new Set(prev);
    next.delete(id);
    return next;
  });
  setOptimisticSent(prev => {
    const next = new Set(prev);
    next.delete(id);
    return next;
  });
  
  loadMyRequestsAndFriends();
};


  const onRelationshipUpdate = () => {
    console.log("🟠 Relationship update (Window)");
    loadFriendsList();
    loadMyRequestsAndFriends();
  };

  const onFriendsUpdated = () => {
    console.log("🟣 Friends Updated (Window)");
    loadFriendsList();
    loadMyRequestsAndFriends();
  };
  
  // For online/offline, a full list reload is the simplest approach
  const onPresenceUpdate = () => {
    loadFriendsList();
  };


  // ----------------------------------------------------
  // ⭐ THE FIX: Attach Window Listeners ⭐
  // ----------------------------------------------------
  window.addEventListener("friend_request_received", onFriendRequestReceived);
  window.addEventListener("friend_request_accepted", onFriendRequestAccepted);
  window.addEventListener("friend_request_rejected", onFriendRequestRejected);
  
  window.addEventListener("relationship_update", onRelationshipUpdate);
  window.addEventListener("friends_updated", onFriendsUpdated);
  
  // Presence Events (friend-online / friend-offline are the names dispatched by SocketContext)
  window.addEventListener("friend-online", onPresenceUpdate);
  window.addEventListener("friend-offline", onPresenceUpdate);


  return () => {
    // ----------------------------------------------------
    // ⭐ CLEANUP Window Listeners ⭐
    // ----------------------------------------------------
    window.removeEventListener("friend_request_received", onFriendRequestReceived);
    window.removeEventListener("friend_request_accepted", onFriendRequestAccepted);
    window.removeEventListener("friend_request_rejected", onFriendRequestRejected);
    
    window.removeEventListener("relationship_update", onRelationshipUpdate);
    window.removeEventListener("friends_updated", onFriendsUpdated);

    window.removeEventListener("friend-online", onPresenceUpdate);
    window.removeEventListener("friend-offline", onPresenceUpdate);
  };
}, [visible, user?._id]); // Dependencies remain the same



  // Search users (debounced)
  useEffect(() => {
    if (!visible) return;
    setSearchPage(1);

    if (searchAbortRef.current) {
      try {
        searchAbortRef.current.abort();
      } catch {}
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
        const res = await API.get(`/users/search?q=${q}`, { signal: controller.signal });

        if (!isMountedRef.current) return;
        const list = (res.data || []).filter((u) => {
          if (!u) return false;
          if (user?._id && u._id && u._id.toString() === user._id.toString()) return false;
          if (user?.username && u.username && u.username === user.username) return false;
          return true;
        });

        // const annotated = list.map((u) => {
        //   const id = norm(u._id);
        //   let status = "none";
        //   if (id && friendIds.has(id)) status = "friend";
        //   else if (id && incomingIds.has(id)) status = "incoming";
        //   else if (id && outgoingIds.has(id)) status = "outgoing";
        //   if (id && optimisticSent.has(id)) status = "outgoing";
        //   return { ...u, _status: status };
        // });

        const annotated = list.map((u) => {
  const id = extractId(u);
 // ⭐ DEBUG LOG — add this
  console.log("CHECK USER STATUS:", {
    username: u.username, 
    id,
    incomingIds: Array.from(incomingIds),
    incoming: incomingIds.has(id),
    outgoing: outgoingIds.has(id),
    friend: friendIds.has(id),
  });

  let status = "none";

  if (friendIds.has(id)) {
    status = "friend";
  } 
  else if (incomingIds.has(id)) {
    status = "incoming";  // ⭐ Receiver will now properly see ACCEPT / REJECT
  } 
  else if (outgoingIds.has(id) || optimisticSent.has(id)) {
    status = "outgoing";  // Sent / Cancel
  }

  return { ...u, _status: status };
});


        setSearchResults(annotated);
      } catch (err) {
        if (err?.name === "CanceledError" || err?.name === "AbortError") {
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
      try {
        controller.abort();
      } catch {}
    };
    // eslint-disable-next-line
  }, [searchTerm, incomingIds, outgoingIds, friendIds, optimisticSent, visible]);

  // Actions
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
    if (!toUserId) {
         console.error("❌ Send Request Failed: toUserId is missing!"); // <<-- NEW LOG
         return;
    }
    const sid = norm(toUserId);
    console.log("⚠️ SEND REQUEST PAYLOAD:", { toUserId: sid });
    try {
      optimisticAddOutgoing(sid);
      await API.post("/friends/request", { toUserId: sid });
      // server will emit and UI will refresh via relationship_update/friends_updated
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
      removeOptimistic(sid);
      await API.post("/friends/request/cancel", { toUserId: sid });
      await loadMyRequestsAndFriends();
    } catch (err) {
      console.error("Cancel request failed:", err);
      await loadMyRequestsAndFriends();
      alert(err.response?.data?.message || "Failed to cancel request");
    }
  };

  const handleAcceptRequest = async (fromUserId) => {
    if (!fromUserId) return;
    const sid = norm(fromUserId);
    try {
      await API.post("/friends/request/accept", { fromUserId: sid });
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
      await loadFriendsList();
      await loadMyRequestsAndFriends();
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
      await loadMyRequestsAndFriends();
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
      await loadFriendsList();
      await loadMyRequestsAndFriends();
    } catch (err) {
      console.error("Remove friend failed:", err);
      alert(err.response?.data?.message || "Failed to remove friend");
    }
  };

  const searchActive = searchTerm && searchTerm.trim().length > 0;
  const pagedResults = searchResults.slice(0, searchPage * PAGE_SIZE);

  if (!visible) return null;

  return (
    <div style={styles.backdrop}>
      <div style={styles.modal} ref={containerRef} role="dialog" aria-modal>
        <div style={styles.header}>
          <div style={{ fontWeight: 800, fontSize: 18, color: "#e6f0ff" }}>Friends</div>

          <div style={{ display: "flex", gap: 8 }}>
            <button style={styles.iconBtn} onClick={() => setShowShare(true)} title="Share profile">
              ↗
            </button>

            <button style={styles.closeBtn} onClick={() => onClose && onClose()} aria-label="Close">
              ✕
            </button>
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          {/* Search */}
          <div style={styles.searchRow}>
            <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search new or existing friends" style={styles.searchInput} />
            {searchTerm ? (
              <button onClick={() => setSearchTerm("")} style={styles.clearBtn} aria-label="Clear search">
                ✕
              </button>
            ) : null}
          </div>

          {/* CTA */}
          <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
            <button style={styles.playBtn} onClick={() => (window.location.href = "/online-multiplayer")}>
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
                            <img src={u.avatar || "/avatars/default.png"} alt={u.username} style={styles.smallAvatar} onError={(e) => (e.currentTarget.src = "/avatars/default.png")} onClick={() => { onClose && onClose(); navigate(`/user/${encodeURIComponent(u.username)}`); }} />
                            <div>
                              <div style={{ fontWeight: 800, color: "#fff", cursor: "pointer" }} onClick={() => { onClose && onClose(); navigate(`/user/${encodeURIComponent(u.username)}`); }}>
                                {u.username}
                              </div>
                              <div style={{ fontSize: 12, color: "#9fb7d9" }}>{u.name}</div>
                            </div>
                          </div>

                          <div>
                            {status === "friend" && (
                              <button style={styles.viewBtn} onClick={() => { onClose && onClose(); navigate(`/user/${encodeURIComponent(u.username)}`); }}>
                                View
                              </button>
                            )}

                            {status === "incoming" && (
                              <div style={{ display: "flex", gap: 8 }}>
                                <button style={styles.acceptBtn} onClick={() => handleAcceptRequest(id)}>Accept</button>
                                <button style={styles.rejectBtn} onClick={() => handleRejectRequest(id)}>Reject</button>
                              </div>
                            )}

                            {status === "outgoing" && (
                              <div style={{ display: "flex", gap: 8 }}>
                                <button style={styles.sentBtn} disabled>Sent</button>
                                <button style={styles.cancelBtn} onClick={() => handleCancelRequest(id)}>Cancel</button>
                              </div>
                            )}

                            {status === "none" && (
                              <button style={styles.addBtn} onClick={() => handleSendRequest(id)}>Add</button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {pagedResults.length > 0 && pagedResults.length < searchResults.length && (
                  <div style={{ marginTop: 12, textAlign: "center" }}>
                    <button style={styles.showMoreBtn} onClick={() => setSearchPage((p) => p + 1)}>Show more</button>
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
                            <img src={f.avatar || "/avatars/default.png"} alt={f.username} style={styles.smallAvatar} onError={(e) => (e.currentTarget.src = "/avatars/default.png")} onClick={() => { onClose && onClose(); navigate(`/user/${encodeURIComponent(f.username)}`); }} />
                            <span style={styles.onlineDot} />
                          </div>
                          <div>
                            <div style={{ fontWeight: 800, color: "#fff", cursor: "pointer" }} onClick={() => { onClose && onClose(); navigate(`/user/${encodeURIComponent(f.username)}`); }}>
                              {f.username || f.name}
                            </div>
                            <div style={{ fontSize: 12, color: "#9fb7d9" }}>{f.name}</div>
                          </div>
                        </div>

                        <div style={{ display: "flex", gap: 8 }}>
                          <button style={styles.viewProfileBtn} onClick={() => { onClose && onClose(); navigate(`/user/${encodeURIComponent(f.username)}`); }}>
                            View
                          </button>
                          <button style={styles.removeFriendBtn} onClick={() => handleRemoveFriend(f.id)}>Unfriend</button>
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
                          <img src={f.avatar || "/avatars/default.png"} alt={f.username} style={styles.smallAvatar} onError={(e) => (e.currentTarget.src = "/avatars/default.png")} onClick={() => { onClose && onClose(); navigate(`/user/${encodeURIComponent(f.username)}`); }} />
                          <div>
                            <div style={{ fontWeight: 800, color: "#fff", cursor: "pointer" }} onClick={() => { onClose && onClose(); navigate(`/user/${encodeURIComponent(f.username)}`); }}>
                              {f.username || f.name}
                            </div>
                            <div style={{ fontSize: 12, color: "#9fb7d9" }}>{f.name}</div>
                          </div>
                        </div>

                        <div style={{ display: "flex", gap: 8 }}>
                          <button style={styles.viewProfileBtn} onClick={() => { onClose && onClose(); navigate(`/user/${encodeURIComponent(f.username)}`); }}>
                            View
                          </button>
                          <button style={styles.removeFriendBtn} onClick={() => handleRemoveFriend(f.id)}>Unfriend</button>
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

      {showShare && <ShareProfileModal visible={showShare} onClose={() => setShowShare(false)} user={user} />}
    </div>
  );
}

/* styles: reuse your original styles — keep same as the code you already had */
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