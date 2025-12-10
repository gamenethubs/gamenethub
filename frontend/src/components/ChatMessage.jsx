// src/components/ChatMessage.jsx
import React from "react";

function formatTime(dateString) {
  if (!dateString) return "";
  const d = new Date(dateString);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function ChatMessage({ message, isMine }) {
  const expired =
    message.expiresAt && new Date(message.expiresAt).getTime() <= Date.now();

  if (expired) return null; // 24h se purane hide

  return (
    <div className={`chat-row ${isMine ? "chat-row-mine" : "chat-row-their"}`}>
      <div className={`chat-bubble ${isMine ? "chat-bubble-mine" : "chat-bubble-their"}`}>
        <div className="chat-text">{message.text}</div>
        <div className="chat-meta">
          <span className="chat-time">{formatTime(message.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}
