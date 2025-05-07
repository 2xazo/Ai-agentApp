// src/hooks/useTranscription.jsx
import { useState, useCallback } from 'react';
import { transcribeAudio } from '../services/openai';

export function useTranscription() {
  const [transcript, setTranscript] = useState('');
  const [status, setStatus] = useState('idle');

  const transcribe = useCallback(async (file) => {
    setStatus('processing');
    try {
      const text = await transcribeAudio(file);
      setTranscript(text);
      setStatus('done');
    } catch (error) {
      console.error('Transcription error:', error);
      setStatus('error');
    }
  }, []);

  return { transcript, status, transcribe };
}