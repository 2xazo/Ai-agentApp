// src/components/transcription/AudioUpload.jsx
import React from 'react';

export default function AudioUpload({ onFile }) {
  return (
    <input type="file" accept="audio/*" onChange={(e) => onFile(e.target.files[0])} />
  );
}