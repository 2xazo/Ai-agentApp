// src/components/transcription/AudioUpload.jsx
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUpload, FiFile } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { transcribeAudio } from '../../services/openai';

export default function AudioUpload({ onTranscriptionStart, onTranscriptionComplete }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
            : 'border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400'
          }`}
      >
        <input {...getInputProps()} />
        <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {isDragActive
            ? 'Drop the audio file here'
            : 'Drag and drop an audio file here, or click to select'}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
          Supported formats: MP3, WAV, M4A, OGG
        </p>
      </div>

      {selectedFile && (
        <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <div className="flex items-center space-x-3">
            <FiFile className="h-6 w-6 text-gray-400" />
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
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Transcribing...
            </div>
          )}
        </div>
      )}
    </div>
  );
}