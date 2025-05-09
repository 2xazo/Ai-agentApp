// src/components/chat/Message.jsx
import React from 'react';
import { useTextToSpeech } from '../../hooks/useTextToSpeech';
import { SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/react/24/solid';
import { formatTime } from '../../utils/formatTime';
import ReactMarkdown from 'react-markdown';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import { SparklesIcon } from '@heroicons/react/24/outline';

export default function Message({ message }) {
  const { speak, stop, isSpeaking } = useTextToSpeech();
  const isUser = message.role === 'user';

  const handleSpeak = () => {
    if (isSpeaking) {
      stop();
    } else {
      speak(message.content);
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
          <div className="flex items-center justify-between mt-1">
            <div
              className={`text-xs ${
                isUser ? 'text-purple-200' : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              {formatTime(message.timestamp)}
            </div>
            {!isUser && (
              <button
                onClick={handleSpeak}
                className={`ml-2 p-1 rounded-full transition-all duration-300 ${
                  isSpeaking
                    ? 'text-red-600 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300'
                    : 'text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400'
                }`}
                aria-label={isSpeaking ? 'Stop speaking' : 'Speak message'}
              >
                {isSpeaking ? (
                  <SpeakerXMarkIcon className="h-4 w-4" />
                ) : (
                  <SpeakerWaveIcon className="h-4 w-4" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}