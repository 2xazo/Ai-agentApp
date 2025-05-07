// src/components/transcription/TranscriptionViewer.jsx
import React, { useState } from 'react';
import AudioUpload from './AudioUpload';
import ProgressIndicator from './ProgressIndicator';

export default function TranscriptionViewer() {
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcription, setTranscription] = useState('');

  const handleTranscriptionComplete = (text) => {
    setTranscription(text);
    setIsTranscribing(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Audio Transcription</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <AudioUpload 
          onTranscriptionStart={() => setIsTranscribing(true)}
          onTranscriptionComplete={handleTranscriptionComplete}
        />

        {isTranscribing && (
          <div className="mt-6">
            <ProgressIndicator />
          </div>
        )}

        {transcription && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Transcription Result</h2>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{transcription}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}