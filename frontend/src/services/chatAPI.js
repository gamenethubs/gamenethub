// src/services/chatAPI.js
import API from "./api";

// Load last 24 hours of conversation with a friend
export async function fetchConversation(friendId) {
  if (!friendId) return [];
  const res = await API.get(`/chat/${friendId}`);
  return res.data?.messages || [];
}
