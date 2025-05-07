// src/components/chat/Message.jsx
import React from 'react';

export default function Message({ message }) {
  const { from, text } = message;
  return (
    <div className={from === 'ai' ? 'text-left' : 'text-right'}>
      <div className="inline-block p-2 rounded-lg bg-blue-200 dark:bg-blue-700">
        {text}
      </div>
    </div>
  );
}