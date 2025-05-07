// src/hooks/useChat.jsx
import { useState, useCallback } from 'react';
import { sendMessage as sendOpenAIMessage } from '../services/openai';
import { toast } from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';

export function useChat(conversationId) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = useCallback(async (text) => {
    if (!text.trim()) return;
    
    setLoading(true);
    try {
      // Add user message immediately
      const userMessage = {
        id: uuidv4(),
        role: 'user',
        content: text.trim(),
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, userMessage]);

      // Get AI response
      const response = await sendOpenAIMessage([...messages, userMessage]);
      
      // Add AI response
      const aiMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      toast.error('Failed to get response from AI. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [messages]); // Include messages in dependencies to maintain conversation context

  return { messages, sendMessage, loading };
}