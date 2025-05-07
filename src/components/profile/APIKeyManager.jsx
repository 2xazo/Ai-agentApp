// src/components/profile/APIKeyManager.jsx
import React, { useState } from 'react';
import { validateApiKey } from '../../utils/validation';
import { useApp } from '../../context/AppContext';

export default function APIKeyManager() {
  const { state, dispatch } = useApp();
  const [key, setKey] = useState('');
  const [error, setError] = useState(null);

  const handleSave = () => {
    if (validateApiKey(key)) {
      dispatch({ type: 'ADD_API_KEY', payload: key });
      setError(null);
      setKey('');
    } else {
      setError('Invalid key');
    }
  };

  return (
    <div>
      <input
        className="p-2 border rounded"
        value={key}
        onChange={(e) => setKey(e.target.value)}
        placeholder="Enter API Key"
      />
      <button onClick={handleSave}>Save</button>
      {error && <p className="text-red-500">{error}</p>}
      <ul>
        {state.apiKeys.map((k, i) => <li key={i}>{k}</li>)}
      </ul>
    </div>
  );
}