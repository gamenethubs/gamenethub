// src/context/SocketContext.jsx
import React, { createContext, useContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const socketRef = useRef({});
  const heartbeatRef = useRef(null);

  useEffect(() => {
    const TOKEN = localStorage.getItem("token") || null;

    const SERVER =
      (process.env.REACT_APP_API_BASE ||
        "https://gamenethub.onrender.com").replace(/\/+$/, "");

    console.log("🔥 INIT SOCKETS on:", SERVER);

    // ======================================================
    // MAIN SOCKET (/)
    // ======================================================
    const mainSocket = io(SERVER, {
      transports: ["websocket", "polling"],
      withCredentials: true,
      auth: { token: TOKEN },
      reconnection: true,
      reconnectionAttempts: 15,
      reconnectionDelayMax: 4000,
    });

    socketRef.current.main = mainSocket;

    mainSocket.on("connect", () => {
      console.log("🟢 MAIN CONNECTED:", mainSocket.id);
    });

    mainSocket.on("disconnect", (reason) => {
      console.log("🔴 MAIN DISCONNECTED:", reason);
    });

    const dispatch = (name, detail) => {
      window.dispatchEvent(new CustomEvent(name, { detail }));
    };

    // --- GAME NOTIFICATIONS ---
    mainSocket.on("new-game-added", (game) => {
      dispatch("notify-user", {
        id: Date.now(),
        title: game.title,
        slug: game.slug,
        thumbnail: game.thumbnail,
        text: `${game.title} is now available!`,
        time: new Date().toLocaleTimeString(),
      });
    });

    // --- FRIEND EVENTS (main) ---
    mainSocket.on("friend_request_received", (payload) => {
      dispatch("friend_request_received", payload);
      dispatch("notify-user", {
        id: Date.now(),
        title: "New Friend Request",
        text: `${payload?.from?.username} sent you a friend request.`,
        thumbnail: payload?.from?.avatar,
        slug: "friends",
        time: new Date().toLocaleTimeString(),
      });
    });

    mainSocket.on("friend_request_accepted", (payload) => {
      dispatch("friend_request_accepted", payload);
      dispatch("notify-user", {
        id: Date.now(),
        title: "Friend Request Accepted",
        text: `${payload?.user?.username} accepted your request.`,
        thumbnail: payload?.user?.avatar,
        slug: "friends",
        time: new Date().toLocaleTimeString(),
      });
    });

    mainSocket.on("friend_request_rejected", (payload) => {
      dispatch("friend_request_rejected", payload);
      dispatch("notify-user", {
        id: Date.now(),
        title: "Friend Request Rejected",
        text: `Your friend request was rejected.`,
        slug: "friends",
        time: new Date().toLocaleTimeString(),
      });
    });

    // ======================================================
    // PRESENCE SOCKET (/presence) – requires JWT token
    // ======================================================
    if (TOKEN) {
      const presenceSocket = io(`${SERVER}/presence`, {
        transports: ["websocket", "polling"],
        auth: { token: TOKEN },
        withCredentials: true,
      });

      socketRef.current.presence = presenceSocket;

      presenceSocket.on("connect", () => {
        console.log("🟢 PRESENCE CONNECTED:", presenceSocket.id);
      });

      presenceSocket.on("disconnect", (reason) => {
        console.log("🔴 PRESENCE DISCONNECTED:", reason);
      });

      // --- ONLINE / OFFLINE EVENTS ---
      presenceSocket.on("friend_online", ({ userId }) => {
        dispatch("friend-online", { userId });
      });

      presenceSocket.on("friend_offline", ({ userId }) => {
        dispatch("friend-offline", { userId });
      });

      // ⭐ NEW — FRIEND EVENTS ON PRESENCE SOCKET (important!!)
      presenceSocket.on("friend_request_received", (payload) => {
        dispatch("friend_request_received", payload);
        dispatch("notify-user", {
          id: Date.now(),
          title: "New Friend Request",
          text: `${payload?.from?.username} sent you a friend request.`,
          thumbnail: payload?.from?.avatar,
          slug: "friends",
          time: new Date().toLocaleTimeString(),
        });
      });

      presenceSocket.on("friend_request_accepted", (payload) => {
        dispatch("friend_request_accepted", payload);
        dispatch("notify-user", {
          id: Date.now(),
          title: "Friend Request Accepted",
          text: `${payload?.user?.username} accepted your request.`,
          thumbnail: payload?.user?.avatar,
          slug: "friends",
          time: new Date().toLocaleTimeString(),
        });
      });

      presenceSocket.on("friend_request_rejected", (payload) => {
        dispatch("friend_request_rejected", payload);
        dispatch("notify-user", {
          id: Date.now(),
          title: "Friend Request Rejected",
          text: `Your friend request was rejected.`,
          slug: "friends",
          time: new Date().toLocaleTimeString(),
        });
      });
    }

    // ======================================================
    // HEARTBEAT (keep presence alive)
    // ======================================================
    const sendHB = () => {
      if (socketRef.current.presence?.connected) {
        socketRef.current.presence.emit("heartbeat", { ts: Date.now() });
      }
    };

    heartbeatRef.current = setInterval(sendHB, 25000);

    return () => {
      try {
        socketRef.current.main?.disconnect();
        socketRef.current.presence?.disconnect();
      } catch {}

      clearInterval(heartbeatRef.current);
    };
  }, []);

  return (
    <SocketContext.Provider value={socketRef}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext);
export default SocketContext;
