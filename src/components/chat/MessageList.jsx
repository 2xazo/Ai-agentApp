// src/components/chat/MessageList.jsx
import { memo } from 'react';
import ReactMarkdown from 'react-markdown';
import { UserCircleIcon } from '@heroicons/react/24/solid';
import { SparklesIcon } from '@heroicons/react/24/outline';

const Message = memo(({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start max-w-3xl`}>
        <div className="flex-shrink-0">
          {isUser ? (
            <UserCircleIcon className="h-8 w-8 text-gray-400" />
          ) : (
            <SparklesIcon className="h-8 w-8 text-indigo-500" />
          )}
        </div>
        <div
          className={`ml-3 mr-3 px-4 py-2 rounded-lg ${
            isUser
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
          }`}
        >
          <div className="prose dark:prose-invert max-w-none">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
          <div
            className={`text-xs mt-1 ${
              isUser ? 'text-indigo-200' : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            {new Date(message.timestamp).toLocaleTimeString()}
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
      <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
        No messages yet. Start a conversation!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
    </div>
  );
}