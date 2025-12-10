// src/components/TypingIndicator.jsx
import React from "react";

export default function TypingIndicator() {
  return (
    <div className="chat-row chat-row-their">
      <div className="chat-bubble chat-bubble-typing">
        <span className="dot" />
        <span className="dot" />
        <span className="dot" />
      </div>
    </div>
  );
}
