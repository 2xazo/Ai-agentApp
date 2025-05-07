// src/components/transcription/ProgressIndicator.jsx
import React from 'react';

export default function ProgressIndicator({ status }) {
  return <div>{status === 'processing' ? 'Transcribing...' : null}</div>;
}