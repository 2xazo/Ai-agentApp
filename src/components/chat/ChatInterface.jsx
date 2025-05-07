// src/components/chat/ChatInterface.jsx
import { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { v4 as uuidv4 } from 'uuid';

export default function ChatInterface() {
  const { state, dispatch } = useApp();

  // BOOTSTRAP A NEW CONVERSATION ONCE
  useEffect(() => {
    if (!state.currentConversation) {
      const conv = {
        id: uuidv4(),
        title: 'New Conversation',
        messages: [],
        createdAt: new Date().toISOString(),
      };
      dispatch({ type: 'ADD_CONVERSATION',        payload: conv });
      dispatch({ type: 'SET_CURRENT_CONVERSATION', payload: conv });
    }
  }, [state.currentConversation, dispatch]);

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.currentConversation?.messages]);

  const handleSendMessage = async (message) => {
    if (!message.trim()) return;

    // add user message
    const userMessage = {
      id: uuidv4(),
      content: message.trim(),
      role: 'user',
      timestamp: new Date().toISOString(),
    };
    dispatch({
      type: 'ADD_MESSAGE',
      payload: {
        conversationId: state.currentConversation.id,
        message: userMessage,
      },
    });

    setInputMessage('');
    setIsLoading(true);

    // placeholder AI reply (swap in your OpenAI call here)
    const aiMessage = {
      id: uuidv4(),
      content: 'This is a placeholder response. OpenAI API integration goes here.',
      role: 'assistant',
      timestamp: new Date().toISOString(),
    };
    dispatch({
      type: 'ADD_MESSAGE',
      payload: {
        conversationId: state.currentConversation.id,
        message: aiMessage,
      },
    });

    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-full w-full">
      {/* message history */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        {state.currentConversation && (
          <MessageList messages={state.currentConversation.messages} />
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* input */}
      <div className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="max-w-2xl mx-auto w-full">
          <MessageInput
            value={inputMessage}
            onChange={setInputMessage}
            onSend={handleSendMessage}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
