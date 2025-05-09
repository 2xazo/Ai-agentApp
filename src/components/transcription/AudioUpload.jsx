// src/components/transcription/AudioUpload.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUpload, FiFile, FiMic, FiStopCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { transcribeAudio } from '../../services/openai';

export default function AudioUpload({ onTranscriptionStart, onTranscriptionComplete }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingTimer, setRecordingTimer] = useState(null);
  const [audioStream, setAudioStream] = useState(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'audio/*': ['.mp3', '.wav', '.m4a', '.ogg']
    },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setSelectedFile(file);
        
        try {
          setIsLoading(true);
          onTranscriptionStart();

          const text = await transcribeAudio(file);
          onTranscriptionComplete(text);
          toast.success('Transcription completed successfully!');
        } catch (error) {
          console.error('Transcription error:', error);
          if (error.message.includes('API key')) {
            toast.error('Please set your OpenAI API key in the Profile section');
          } else {
            toast.error('Failed to transcribe audio. Please try again.');
          }
        } finally {
          setIsLoading(false);
        }
      }
    }
  });

  // Cleanup function to stop recording and release resources
  const cleanupRecording = () => {
    if (audioStream) {
      audioStream.getTracks().forEach(track => track.stop());
    }
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    }
    if (recordingTimer) {
      clearInterval(recordingTimer);
    }
    setAudioStream(null);
    setMediaRecorder(null);
    setAudioChunks([]);
    setRecordingTime(0);
    setIsRecording(false);
  };

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      cleanupRecording();
    };
  }, []);

  const startRecording = async () => {
    try {
      // Request microphone permission with specific constraints
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100,
          channelCount: 1
        }
      });

      setAudioStream(stream);

      // Create MediaRecorder with specific MIME type and bitrate
      const recorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus',
        audioBitsPerSecond: 128000
      });

      const chunks = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
          setAudioChunks(chunks);
        }
      };

      recorder.onstop = async () => {
        try {
          const audioBlob = new Blob(chunks, { type: 'audio/webm;codecs=opus' });
          const audioFile = new File([audioBlob], `recording_${new Date().toISOString()}.webm`, {
            type: 'audio/webm;codecs=opus'
          });
          
          setSelectedFile(audioFile);
          setIsLoading(true);
          onTranscriptionStart();

          const text = await transcribeAudio(audioFile);
          onTranscriptionComplete(text);
          toast.success('Transcription completed successfully!');
        } catch (error) {
          console.error('Transcription error:', error);
          if (error.message.includes('API key')) {
            toast.error('Please set your OpenAI API key in the Profile section');
          } else {
            toast.error('Failed to transcribe audio. Please try again.');
          }
        } finally {
          setIsLoading(false);
          cleanupRecording();
        }
      };

      recorder.onerror = (event) => {
        console.error('MediaRecorder error:', event.error);
        toast.error('Error during recording. Please try again.');
        cleanupRecording();
      };

      // Start recording with 1-second timeslices
      recorder.start(1000);
      setMediaRecorder(recorder);
      setIsRecording(true);

      // Start recording timer
      const timer = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      setRecordingTimer(timer);

      toast.success('Recording started...');
    } catch (error) {
      console.error('Error starting recording:', error);
      if (error.name === 'NotAllowedError') {
        toast.error('Microphone access denied. Please allow microphone access in your browser settings.');
      } else if (error.name === 'NotFoundError') {
        toast.error('No microphone detected. Please check your microphone connection.');
      } else {
        toast.error('Failed to start recording. Please try again.');
      }
      cleanupRecording();
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      toast.success('Recording stopped. Processing...');
    }
  };

  // Format recording time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-4">
        {/* File Upload Area */}
        <div
          {...getRootProps()}
          className={`flex-1 border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300
            ${isDragActive 
              ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' 
              : 'border-gray-300 dark:border-gray-600 hover:border-indigo-500 dark:hover:border-indigo-400'
            }`}
        >
          <input {...getInputProps()} />
          <FiUpload className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 transition-colors duration-300" />
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {isDragActive
              ? 'Drop the audio file here'
              : 'Drag and drop an audio file here, or click to select'}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Supported formats: MP3, WAV, M4A, OGG
          </p>
        </div>

        {/* Voice Recording Button */}
        <div className="flex flex-col items-center space-y-2">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isLoading}
            className={`flex items-center justify-center px-6 rounded-lg border-2 transition-all duration-300 transform hover:scale-105 ${
              isRecording
                ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 animate-pulse'
                : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-indigo-500 dark:hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isRecording ? (
              <>
                <FiStopCircle className="h-6 w-6 mr-2 transform transition-transform duration-300 hover:rotate-90 text-red-600 dark:text-red-400" />
                <span className="font-medium text-red-600 dark:text-red-400">Stop Recording</span>
              </>
            ) : (
              <>
                <FiMic className="h-6 w-6 mr-2 transform transition-transform duration-300 hover:scale-110 text-gray-600 dark:text-gray-400" />
                <span className="font-medium text-gray-600 dark:text-gray-400">Record Voice</span>
              </>
            )}
          </button>
          {isRecording && (
            <div className="text-sm font-medium text-red-600 dark:text-red-400 animate-pulse">
              Recording: {formatTime(recordingTime)}
            </div>
          )}
        </div>
      </div>

      {selectedFile && (
        <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <div className="flex items-center space-x-3">
            <FiFile className="h-6 w-6 text-gray-400 dark:text-gray-500 transition-colors duration-300" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {selectedFile.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          {isLoading && (
            <div className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">
              Transcribing...
            </div>
          )}
        </div>
      )}
    </div>
  );
}