// src/components/transcription/TranscriptionViewer.jsx
import React, { useState } from 'react';
import AudioUpload from './AudioUpload';
import ProgressIndicator from './ProgressIndicator';
import { FiCopy, FiCheck, FiEdit2, FiSave } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function TranscriptionViewer() {
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState('');

  const handleTranscriptionComplete = (text) => {
    setTranscription(text);
    setEditedText(text);
    setIsTranscribing(false);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(transcription);
      setIsCopied(true);
      toast.success('Text copied to clipboard!');
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
      toast.error('Failed to copy text to clipboard');
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedText(transcription);
  };

  const handleSave = () => {
    setTranscription(editedText);
    setIsEditing(false);
    toast.success('Transcription updated successfully!');
  };

  const handleCancel = () => {
    setEditedText(transcription);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Audio Transcription</h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <AudioUpload 
            onTranscriptionStart={() => setIsTranscribing(true)}
            onTranscriptionComplete={handleTranscriptionComplete}
          />

          {isTranscribing && (
            <div className="mt-6">
              <ProgressIndicator />
            </div>
          )}
        </div>

        {transcription && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Transcription Result</h2>
              <div className="flex space-x-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSave}
                      className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors duration-200"
                    >
                      <FiSave className="h-4 w-4" />
                      <span>Save</span>
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md transition-colors duration-200"
                    >
                      <span>Cancel</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleEdit}
                      className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors duration-200"
                    >
                      <FiEdit2 className="h-4 w-4" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={handleCopy}
                      className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors duration-200"
                    >
                      {isCopied ? (
                        <>
                          <FiCheck className="h-4 w-4" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <FiCopy className="h-4 w-4" />
                          <span>Copy Text</span>
                        </>
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              {isEditing ? (
                <div className="relative">
                  <textarea
                    value={editedText}
                    onChange={(e) => setEditedText(e.target.value)}
                    className="w-full min-h-[200px] p-4 text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
                    placeholder="Edit your transcription here..."
                  />
                  <div className="absolute bottom-2 right-2 text-xs text-gray-500 dark:text-gray-400">
                    {editedText.length} characters
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{transcription}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}