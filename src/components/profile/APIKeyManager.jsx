// src/components/profile/APIKeyManager.jsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

export default function APIKeyManager() {
  const [apiKey, setApiKey] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    // Load API key from localStorage on component mount
    const savedApiKey = localStorage.getItem('openai_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
      setIsValid(true);
    }
  }, []);

  const validateApiKey = (key) => {
    // Basic OpenAI API key validation (starts with 'sk-' and has correct length)
    return key.startsWith('sk-') && key.length > 20;
  };

  const handleSave = () => {
    const trimmedKey = apiKey.trim();
    
    if (!trimmedKey) {
      toast.error('Please enter an API key');
      return;
    }

    if (!validateApiKey(trimmedKey)) {
      toast.error('Invalid API key format. It should start with "sk-"');
      return;
    }

    try {
      localStorage.setItem('openai_api_key', trimmedKey);
      setIsValid(true);
      toast.success('API key saved successfully');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to save API key');
      console.error('Error saving API key:', error);
    }
  };

  const handleClear = () => {
    try {
      localStorage.removeItem('openai_api_key');
      setApiKey('');
      setIsValid(false);
      toast.success('API key cleared successfully');
    } catch (error) {
      toast.error('Failed to clear API key');
      console.error('Error clearing API key:', error);
    }
  };

  const handleKeyChange = (e) => {
    const newKey = e.target.value;
    setApiKey(newKey);
    setIsValid(validateApiKey(newKey));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">API Key Management</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              OpenAI API Key
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <input
                type={isEditing ? 'text' : 'password'}
                id="apiKey"
                value={apiKey}
                onChange={handleKeyChange}
                disabled={!isEditing}
                className={`flex-1 min-w-0 block w-full px-3 py-2 rounded-md border ${
                  isValid ? 'border-green-500' : 'border-gray-300 dark:border-gray-600'
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50`}
                placeholder="Enter your OpenAI API key (starts with sk-...)"
              />
            </div>
            {isEditing && !isValid && apiKey && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                Invalid API key format. It should start with "sk-"
              </p>
            )}
          </div>

          <div className="flex space-x-4">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  disabled={!isValid}
                  className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                    isValid ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-400 cursor-not-allowed'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Edit
                </button>
                {apiKey && (
                  <button
                    onClick={handleClear}
                    className="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Clear
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}