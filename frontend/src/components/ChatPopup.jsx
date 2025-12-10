// src/components/ChatPopup.jsx
import React, { useEffect, useState, useRef } from "react";
import { X, MessageCircle, Smile } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import { fetchConversation } from "../services/chatAPI";
import ChatMessage from "./ChatMessage";
import TypingIndicator from "./TypingIndicator";
import EmojiPicker from "emoji-picker-react";

const chatStyles = `
.chat-popup-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.35);
  display: flex;

  /* ❌ OLD */
  /* justify-content: flex-end;
     align-items: flex-end; */

  /* ✅ NEW CENTER */
  justify-content: center;
  align-items: start;

  z-index: 5000;
  pointer-events: none;
}


.chat-popup {
  pointer-events: auto;
  margin: 16px;
  width: 360px;
  max-width: 100vw;
  height:auto;
  max-height: 90vw;
  background: rgba(15,23,42,0.95);
  border-radius: 18px;
  border: 1px solid rgba(148,163,184,0.4);
  box-shadow: 0 18px 45px rgba(0,0,0,0.6);
  display: flex;
  flex-direction: column;
   overflow: visible !important;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Inter", sans-serif;
}

/* mobile full width at bottom */
@media (max-width: 640px) {
  .chat-popup {
    width: 100vw;
    margin: 0;
    border-radius: 18px 18px 0 0;
  }
}

.chat-header {
  padding: 10px 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  border-bottom: 1px solid rgba(148,163,184,0.4);
  background: linear-gradient(135deg, rgba(59,130,246,0.25), rgba(15,23,42,0.95));
}

.chat-avatar {
  width: 32px;
  height: 32px;
  border-radius: 999px;
  overflow: hidden;
  position: relative;
  flex-shrink: 0;
}
.chat-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.chat-avatar-ring {
  position: absolute;
  inset: -2px;
  border-radius: inherit;
  border: 1px solid rgba(59,130,246,0.7);
  box-shadow: 0 0 12px rgba(59,130,246,0.8);
}

.chat-title-block {
  flex: 1;
  min-width: 0;
}
.chat-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: #e5f0ff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.chat-subtitle {
  font-size: 0.75rem;
  color: #9ca3af;
}

.chat-close-btn {
  border: none;
  background: transparent;
  color: #cbd5f5;
  cursor: pointer;
  padding: 4px;
  border-radius: 999px;
}
.chat-close-btn:hover {
  background: rgba(15,23,42,0.7);
}

/* body */
.chat-body {
  flex: 1;
  padding: 10px 10px 6px 10px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 4px;
  scroll-behavior: smooth;
  max-height: 350px;
}

/* rows */
.chat-row {
  display: flex;
  margin-bottom: 4px;
}
.chat-row-mine {
  justify-content: flex-end;
}
.chat-row-their {
  justify-content: flex-start;
}

/* bubbles */
.chat-bubble {
  max-width: 80%;
  padding: 8px 10px 6px 10px;
  border-radius: 14px;
  font-size: 0.85rem;
  line-height: 1.4;
  position: relative;
}
.chat-bubble-mine {
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  color: white;
  border-bottom-right-radius: 4px;
}
.chat-bubble-their {
  background: rgba(15,23,42,0.9);
  color: #e5e7eb;
  border: 1px solid rgba(148,163,184,0.5);
  border-bottom-left-radius: 4px;
}
.chat-text {
  word-wrap: break-word;
  white-space: pre-wrap;
}
.chat-meta {
  margin-top: 2px;
  font-size: 0.65rem;
  opacity: 0.7;
  text-align: right;
}
.chat-time {
}

/* typing indicator */
.chat-bubble-typing {
  background: rgba(15,23,42,0.9);
  border-radius: 999px;
  padding: 6px 10px;
  display: flex;
  gap: 4px;
  align-items: center;
  border: 1px solid rgba(148,163,184,0.4);
}
.chat-bubble-typing .dot {
  width: 6px; height: 6px;
  border-radius: 999px;
  background: #9ca3af;
  animation: chat-bounce 1.2s infinite ease-in-out;
}
.chat-bubble-typing .dot:nth-child(2) { animation-delay: 0.15s; }
.chat-bubble-typing .dot:nth-child(3) { animation-delay: 0.3s; }

@keyframes chat-bounce {
  0%, 80%, 100% { transform: translateY(0); opacity: 0.5; }
  40% { transform: translateY(-4px); opacity: 1; }
}

/* footer */
.chat-footer {
  border-top: 1px solid rgba(148,163,184,0.4);
  padding: 6px 8px 8px 8px;
  background: rgba(15,23,42,0.98);
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.chat-input-row {
  display: flex;
  align-items: flex-end;
  gap: 6px;
}

.chat-input {
  flex: 1;
  min-height: 36px;
  max-height: 80px;
  resize: none;
  border-radius: 10px;
  border: 1px solid rgba(148,163,184,0.6);
  background: rgba(15,23,42,0.9);
  color: #e5e7eb;
  font-size: 0.85rem;
  padding: 7px 8px;
  outline: none;
}
.chat-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 1px rgba(59,130,246,0.6);
}

.chat-icon-btn {
  border-radius: 999px;
  border: none;
  background: rgba(15,23,42,0.85);
  color: #9ca3af;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
}
.chat-icon-btn:hover {
  background: rgba(30,64,175,0.9);
  color: #e5e7eb;
}

/* send button */
.chat-send-btn {
  border-radius: 999px;
  border: none;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: white;
  padding: 0 14px;
  height: 32px;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
}
.chat-send-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* emoji picker container (desktop only) */
.chat-emoji-picker {
  margin-top: 4px;
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid rgba(148,163,184,0.4);
  background: #020617;
  display: none;
}
@media (min-width: 768px) {
  .chat-emoji-picker {
    display: block;
  }
}

/* banner */
.chat-banner {
  text-align: center;
  font-size: 0.7rem;
  color: #9ca3af;
}
.chat-banner span {
  color: #fbbf24;
}
 
  @media (max-width: 768px) {
  .chat-icon-btn {
    display: none !important;   /* ✅ Emoji button hide */
  }
}



`;

export default function ChatPopup({ friend, onClose }) {
  const { user: me } = useAuth();
  const socketRef = useSocket();
  const mainSocket = socketRef?.main || null;

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isFriendTyping, setIsFriendTyping] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false); 

  const scrollRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const soundRef = useRef(
    typeof Audio !== "undefined" ? new Audio("/chat-message.mp3") : null
  );

  const myId = me?.id || me?._id;
  const friendId = friend?.id || friend?._id;

  // auto scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isFriendTyping]);

  // load history (last 24h)
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        const msgs = await fetchConversation(friendId);
        if (!cancelled) setMessages(msgs || []);
      } catch (err) {
        console.error("Chat load error:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    if (friendId) load();
    return () => {
      cancelled = true;
    };
  }, [friendId]);

  // socket listeners
  useEffect(() => {
    if (!mainSocket || !myId || !friendId) return;
   
    const handleNewMessage = (msg) => {
  const from = msg.from?.toString?.() ?? msg.from;
  const to = msg.to?.toString?.() ?? msg.to;

  const minePair =
    (from === myId && to === friendId) ||
    (from === friendId && to === myId);

  if (!minePair) return;

  // ✅ 🔥 FIX: agar message mera hi hai → ignore
  if (from === myId) return;

  setMessages((prev) => [...prev, msg]);

  // ✅ sound only for incoming
  if (soundRef.current) {
    soundRef.current.currentTime = 0;
    soundRef.current.play().catch(() => {});
  }
};


    const handleTyping = (payload) => {
      const { fromUserId, isTyping } = payload || {};
      const fromStr = fromUserId?.toString?.() ?? fromUserId;
      if (fromStr !== friendId) return;

      if (isTyping) {
        setIsFriendTyping(true);
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(
          () => setIsFriendTyping(false),
          4000
        );
      } else {
        setIsFriendTyping(false);
      }
    };

    mainSocket.on("chat:new_message", handleNewMessage);
    mainSocket.on("chat:typing", handleTyping);

    return () => {
      mainSocket.off("chat:new_message", handleNewMessage);
      mainSocket.off("chat:typing", handleTyping);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, [mainSocket, myId, friendId]);
    useEffect(() => {
  console.log("✅ SOCKET CHECK:", mainSocket);
}, [mainSocket]);


  // emit typing
  const emitTyping = (isTyping) => {
    if (!mainSocket || !friendId) return;
    mainSocket.emit("chat:typing", { toUserId: friendId, isTyping });
  };

  const handleChange = (e) => {
    setInput(e.target.value);
    emitTyping(true);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => emitTyping(false), 2000);
  };

  const handleSend = () => {
    if (!mainSocket || !input.trim() || !friendId || !myId) return;
    const text = input.trim();
    setInput("");
    setIsSending(true);

    // optimistic local message
    const tempMsg = {
      _id: `temp-${Date.now()}`,
      from: myId,
      to: friendId,
      text,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempMsg]);

    mainSocket.emit(
      "chat:send",
      { toUserId: friendId, text },
      (res) => {
        setIsSending(false);
        if (!res?.ok) {
          console.error("chat send error:", res?.error);
          // optional: revert?
        }
      }
    );
    emitTyping(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleEmojiClick = (emojiData) => {
    const emoji = emojiData?.emoji || "";
    setInput((prev) => (prev || "") + emoji);
    emitTyping(true);
  };

  const handleClose = () => {
    emitTyping(false);
    onClose?.();
  };

  return (
    <>
      <style>{chatStyles}</style>
      <div className="chat-popup-overlay">
        <div className="chat-popup">
          {/* HEADER */}
          <div className="chat-header">
            <div className="chat-avatar">
              <img
                src={friend.avatar || "/avatars/default.png"}
                alt={friend.username}
                onError={(e) => (e.currentTarget.src = "/avatars/default.png")}
              />
              <div className="chat-avatar-ring" />
            </div>
            <div className="chat-title-block">
              <div className="chat-title">{friend.name || friend.username}</div>
              <div className="chat-subtitle">
                24h secret chat • messages auto-disappear
              </div>
            </div>
            <button className="chat-close-btn" onClick={handleClose}>
              <X size={18} />
            </button>
          </div>

          {/* BODY */}
          <div className="chat-body" ref={scrollRef}>
            <div className="chat-banner">
              <span>⏳</span> Messages in this chat are erased after 24 hours.
            </div>
            {loading && (
              <div style={{ textAlign: "center", padding: "12px 0", fontSize: "0.8rem", color: "#9ca3af" }}>
                Loading chat...
              </div>
            )}
            {!loading && messages.length === 0 && (
              <div style={{ textAlign: "center", padding: "16px 0", fontSize: "0.8rem", color: "#9ca3af" }}>
                Say hi! This chat is empty for now.
              </div>
            )}

            {messages.map((m) => (
              <ChatMessage
                key={m._id}
                message={m}
                isMine={(m.from?._id || m.from)?.toString?.() === myId?.toString?.()}
              />
            ))}

            {isFriendTyping && <TypingIndicator />}
          </div>

          {/* FOOTER */}
          <div className="chat-footer">
            <div className="chat-input-row">
              <button
                className="chat-icon-btn"
                type="button"
                onClick={() => setShowEmoji((v) => !v)}
                title="Emoji"
              >
                <Smile size={18} />
              </button>

              <textarea
                className="chat-input"
                rows={1}
                placeholder="Type a message..."
                value={input}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
              />

              <button
                className="chat-send-btn"
                onClick={handleSend}
                disabled={!input.trim() || isSending}
                type="button"
              >
                <MessageCircle size={14} />
                Send
              </button>
            </div>

            {showEmoji && (
              <div className="chat-emoji-picker">
                {/* Desktop emoji keyboard */}
                <EmojiPicker
                  theme="dark"
                  lazyLoadEmojis
                  onEmojiClick={handleEmojiClick}
                  width="100%"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
