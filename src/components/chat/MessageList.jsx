// src/components/chat/MessageList.jsx
import { memo } from 'react';
import ReactMarkdown from 'react-markdown';
import { UserCircleIcon } from '@heroicons/react/24/solid';
import { SparklesIcon } from '@heroicons/react/24/outline';

const Message = memo(({ message }) => {
  const isUser = message.role === 'user';

  const formatTime = (timestamp) => {
    try {
      if (!timestamp) return '';
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) return '';
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (error) {
      console.error('Error formatting time:', error);
      return '';
    }
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start max-w-3xl`}>
        <div className="flex-shrink-0">
          {isUser ? (
            <UserCircleIcon className="h-8 w-8 text-gray-400" />
          ) : (
            <div className="flex flex-col items-center">
              <SparklesIcon className="h-8 w-8 text-purple-600" />
              <span className="text-xs text-purple-600 mt-1">AZO AI</span>
            </div>
          )}
        </div>
        <div
          className={`ml-3 mr-3 px-4 py-2 rounded-lg ${
            isUser
              ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
          }`}
        >
          <div className="prose dark:prose-invert max-w-none">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
          <div
            className={`text-xs mt-1 ${
              isUser ? 'text-purple-200' : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            {formatTime(message.timestamp)}
          </div>
        </div>
      </div>
    </div>
  );
});

Message.displayName = 'Message';

export default function MessageList({ messages }) {
  if (!messages?.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
        <SparklesIcon className="h-12 w-12 text-purple-600 mb-4" />
        <p className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 mb-2">AZO AI Assistant</p>
        <p className="text-center">Start a conversation with AZO AI assistant!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((message, index) => (
        <Message key={message.id || index} message={message} />
      ))}
    </div>
  );
}