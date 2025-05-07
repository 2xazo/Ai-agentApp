// src/pages/ChatPage.jsx
import React from 'react';
import ChatInterface from '../components/chat/ChatInterface';
import { useAuth } from '../context/AuthContext';

export default function ChatPage() {
  const { currentUser } = useAuth();
  return <ChatInterface conversationId={currentUser.uid} />;
}