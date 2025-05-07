// src/context/AppContext.jsx
import React, { createContext, useReducer, useEffect, useContext } from 'react';

const AppContext = createContext();

const initialState = {
  conversations: [],
  currentConversation: null,
  transcriptions: [],
  apiKey: localStorage.getItem('openai_api_key') || '',
  theme: localStorage.getItem('theme') || 'dark',
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_CONVERSATIONS':
      return { ...state, conversations: action.payload };
    case 'ADD_CONVERSATION':
      return { ...state, conversations: [...state.conversations, action.payload] };
    case 'SET_CURRENT_CONVERSATION':
      return { ...state, currentConversation: action.payload };
    case 'ADD_MESSAGE':
      const updatedConversations = state.conversations.map(conv =>
        conv.id === action.payload.conversationId
          ? { ...conv, messages: [...conv.messages, action.payload.message] }
          : conv
      );
      return { ...state, conversations: updatedConversations };
    case 'SET_API_KEY':
      localStorage.setItem('openai_api_key', action.payload);
      return { ...state, apiKey: action.payload };
    case 'ADD_TRANSCRIPTION':
      return { ...state, transcriptions: [...state.transcriptions, action.payload] };
    case 'SET_THEME':
      localStorage.setItem('theme', action.payload);
      return { ...state, theme: action.payload };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    const savedConversations = localStorage.getItem('conversations');
    if (savedConversations) {
      dispatch({ type: 'SET_CONVERSATIONS', payload: JSON.parse(savedConversations) });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('conversations', JSON.stringify(state.conversations));
  }, [state.conversations]);

  const value = {
    state,
    dispatch,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}