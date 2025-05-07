// src/components/chat/ChatInterface.jsx
import { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { v4 as uuidv4 } from 'uuid';
import { useChat } from '../../hooks/useChat';
import { toast } from 'react-hot-toast';
import { SparklesIcon } from '@heroicons/react/24/outline';

export default function ChatInterface() {
  const { state, dispatch } = useApp();
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);
  const { messages, sendMessage, loading } = useChat(state.currentConversation?.id);

  // BOOTSTRAP A NEW CONVERSATION ONCE
  useEffect(() => {
    if (!state.currentConversation) {
      const conv = {
        id: uuidv4(),
        title: 'New Conversation',
        messages: [],
        createdAt: new Date().toISOString(),
      };
      dispatch({ type: 'ADD_CONVERSATION', payload: conv });
      dispatch({ type: 'SET_CURRENT_CONVERSATION', payload: conv });
    }
  }, [state.currentConversation, dispatch]);

  // auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (message) => {
    if (!message.trim()) return;

    const apiKey = localStorage.getItem('openai_api_key');
    if (!apiKey) {
      toast.error('Please set your OpenAI API key in the Profile section');
      return;
    }

    try {
      await sendMessage(message);
      setInputMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-3 shadow-md">
        <div className="max-w-2xl mx-auto w-full flex items-center space-x-2">
          <SparklesIcon className="h-6 w-6 text-white" />
          <h1 className="text-lg font-semibold text-white">AZO AI Assistant</h1>
        </div>
      </div>

      {/* message history */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <MessageList messages={messages} />
        <div ref={messagesEndRef} />
      </div>

      {/* input */}
      <div className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="max-w-2xl mx-auto w-full">
          <MessageInput
            value={inputMessage}
            onChange={setInputMessage}
            onSend={handleSendMessage}
            isLoading={loading}
          />
        </div>
      </div>
    </div>
  );
}
