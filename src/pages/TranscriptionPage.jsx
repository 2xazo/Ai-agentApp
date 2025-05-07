// src/pages/TranscriptionPage.jsx
import React from 'react';
import AudioUpload from '../components/transcription/AudioUpload';
import ProgressIndicator from '../components/transcription/ProgressIndicator';
import TranscriptionViewer from '../components/transcription/TranscriptionViewer';
import { useTranscription } from '../hooks/useTranscription';

export default function TranscriptionPage() {
  const { transcript, status, transcribe } = useTranscription();

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <AudioUpload onFile={transcribe} />
      <ProgressIndicator status={status} />
      {status === 'done' && (
        <TranscriptionViewer transcript={transcript} />
      )}
    </div>
  );
}