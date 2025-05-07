// src/hooks/useChat.jsx
import { useState, useCallback } from 'react';
import { sendChatMessage } from '../services/openai';

export function useChat(conversationId) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = useCallback(async (text) => {
    setLoading(true);
    try {
      const response = await sendChatMessage(conversationId, text);
      setMessages((prev) => [
        ...prev,
        { from: 'user', text },
        { from: 'ai', text: response }
      ]);
    } finally {
      setLoading(false);
    }
  }, [conversationId]);

  return { messages, sendMessage, loading };
}