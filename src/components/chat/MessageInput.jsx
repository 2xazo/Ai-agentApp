// src/components/chat/MessageInput.jsx
import { useRef, useEffect, forwardRef } from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';

const MessageInput = forwardRef(function MessageInput({ value, onChange, onSend, isLoading }, ref) {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  useEffect(() => {
    if (ref && typeof ref === 'object') {
      ref.current = textareaRef.current;
    }
  }, [ref]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (value.trim() && !isLoading) {
      onSend(value.trim());
    }
  };

  return (
    <div className="relative w-full">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message..."
        rows={1}
        className="w-full px-4 py-3 pr-12 text-sm sm:text-base leading-6 text-gray-900 dark:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none overflow-hidden transition-all"
        disabled={isLoading}
      />
      <button
        onClick={handleSend}
        disabled={!value.trim() || isLoading}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        aria-label="Send"
      >
        <PaperAirplaneIcon
          className="h-5 w-5 sm:h-6 sm:w-6"
          style={{ transform: 'rotate(360deg)' }}
        />
      </button>
    </div>
  );
});

export default MessageInput;
