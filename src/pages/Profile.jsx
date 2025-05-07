import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

export default function Profile() {
  const { currentUser } = useAuth();
  const [apiKey, setApiKey] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    // Load existing API key on component mount
    const savedKey = localStorage.getItem('openai_api_key');
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, []);

  const validateApiKey = async (key) => {
    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json'
        }
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  };

  const handleSaveApiKey = async () => {
    if (!apiKey.trim()) {
      toast.error('Please enter an API key');
      return;
    }

    setIsValidating(true);
    try {
      const isValid = await validateApiKey(apiKey);
      if (isValid) {
        localStorage.setItem('openai_api_key', apiKey);
        setIsEditing(false);
        toast.success('API key saved successfully');
      } else {
        toast.error('Invalid API key. Please check and try again.');
      }
    } catch (error) {
      toast.error('Error validating API key');
    } finally {
      setIsValidating(false);
    }
  };

  const handleDeleteApiKey = () => {
    localStorage.removeItem('openai_api_key');
    setApiKey('');
    toast.success('API key removed');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* User Profile Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Profile</h1>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
              <p className="mt-1 text-gray-900 dark:text-white">{currentUser?.email}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">User ID</label>
              <p className="mt-1 text-gray-900 dark:text-white">{currentUser?.uid}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Account Created</label>
              <p className="mt-1 text-gray-900 dark:text-white">
                {currentUser?.metadata?.creationTime ? new Date(currentUser.metadata.creationTime).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* OpenAI API Key Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">OpenAI API Key</h2>
            <div className="space-x-2">
              {!isEditing && apiKey && (
                <button
                  onClick={handleDeleteApiKey}
                  className="text-sm text-red-600 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300"
                >
                  Delete
                </button>
              )}
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
              >
                {isEditing ? 'Cancel' : 'Edit'}
              </button>
            </div>
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  API Key
                </label>
                <input
                  type="password"
                  id="apiKey"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your OpenAI API key"
                  className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                />
              </div>
              <button
                onClick={handleSaveApiKey}
                disabled={isValidating}
                className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isValidating ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Validating...
                  </div>
                ) : (
                  'Save API Key'
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400">
                {apiKey ? 'API key is configured' : 'No API key configured'}
              </p>
              {apiKey && (
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span className="text-sm text-green-600 dark:text-green-400">API key is valid</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 