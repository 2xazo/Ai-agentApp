// src/components/transcription/TranscriptionViewer.jsx
import React from 'react';

export default function TranscriptionViewer({ transcript }) {
  return <pre className="whitespace-pre-wrap">{transcript}</pre>;
}