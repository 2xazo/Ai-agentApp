import React, { useState, useRef, useEffect } from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import { addMessage, subscribeToMessages } from '../../services/messages';
import { toast } from 'react-hot-toast';
import MessageList from './MessageList';
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const { currentUser } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Subscribe to messages
    const unsubscribe = subscribeToMessages((updatedMessages) => {
      setMessages(updatedMessages);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      role: 'user',
      content: inputValue,
      userId: currentUser.uid,
      userEmail: currentUser.email,
      timestamp: new Date()
    };

    setInputValue('');
    setIsLoading(true);

    try {
      // Add user message to Firebase
      await addMessage(userMessage);

      // Make API call to OpenAI
      const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful AI assistant."
          },
          {
            role: "user",
            content: inputValue
          }
        ],
      });

      const aiResponse = completion.data.choices[0].message.content;

      // Add AI response to Firebase
      const assistantMessage = {
        role: 'assistant',
        content: aiResponse,
        userId: 'assistant',
        timestamp: new Date()
      };

      await addMessage(assistantMessage);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-white dark:bg-gray-800">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4">
        <MessageList messages={messages} />
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-2">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Container */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center space-x-4">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
            className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !inputValue.trim()}
            className="rounded-lg bg-indigo-600 p-2 text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <PaperAirplaneIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
} 