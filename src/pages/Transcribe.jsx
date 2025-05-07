import React, { useState } from 'react';
import { MicrophoneIcon, StopIcon } from '@heroicons/react/24/outline';

export default function Transcribe() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');

  const handleStartRecording = () => {
    setIsRecording(true);
    // Add actual recording logic here
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    // Add actual stop recording logic here
    setTranscription('This is a sample transcription. Replace with actual transcription logic.');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Audio Transcription</h1>
          
          <div className="flex justify-center mb-8">
            <button
              onClick={isRecording ? handleStopRecording : handleStartRecording}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg text-white font-medium ${
                isRecording
                  ? 'bg-red-600 hover:bg-red-500'
                  : 'bg-indigo-600 hover:bg-indigo-500'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              {isRecording ? (
                <>
                  <StopIcon className="h-5 w-5" />
                  <span>Stop Recording</span>
                </>
              ) : (
                <>
                  <MicrophoneIcon className="h-5 w-5" />
                  <span>Start Recording</span>
                </>
              )}
            </button>
          </div>

          {transcription && (
            <div className="mt-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Transcription</h2>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <p className="text-gray-900 dark:text-white whitespace-pre-wrap">{transcription}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 