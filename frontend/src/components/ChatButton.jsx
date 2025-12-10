// src/components/ChatButton.jsx
import React, { useState } from "react";
import { MessageCircle } from "lucide-react";
import ChatPopup from "./ChatPopup";

export default function ChatButton({ friend }) {
  const [open, setOpen] = useState(false);

  if (!friend) return null;

  return (
    <>
      <button
        type="button"
        className="pp-btn pp-btn-outline"
        onClick={() => setOpen(true)}
        style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
      >
        <MessageCircle size={16} />
        Chat
      </button>

      {open && (
        <ChatPopup
          friend={friend}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
