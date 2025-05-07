// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import Layout from './components/shared/Layout';
import ProtectedRoute from './components/shared/ProtectedRoute';
import Home from './pages/Home';
import { useAuth } from './context/AuthContext';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ChatInterface from './components/chat/ChatInterface';
import TranscriptionViewer from './components/transcription/TranscriptionViewer';
import APIKeyManager from './components/profile/APIKeyManager';

const queryClient = new QueryClient();

function App() {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      return savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    }
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppProvider>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />

              {/* Protected Routes */}
              <Route
                path="/chat"
                element={
                  <ProtectedRoute>
                    <Layout theme={theme} setTheme={setTheme}>
                      <ChatInterface />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/transcribe"
                element={
                  <ProtectedRoute>
                    <Layout theme={theme} setTheme={setTheme}>
                      <TranscriptionViewer />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Layout theme={theme} setTheme={setTheme}>
                      <APIKeyManager />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              {/* Fallback Route */}
              <Route
                path="*"
                element={
                  <Layout theme={theme} setTheme={setTheme}>
                    <Navigate to="/" replace />
                  </Layout>
                }
              />
            </Routes>
            <Toaster
              position="top-right"
              toastOptions={{
                className: 'dark:bg-gray-800 dark:text-white',
                style: {
                  background: theme === 'dark' ? '#1f2937' : '#fff',
                  color: theme === 'dark' ? '#fff' : '#000',
                },
              }}
            />
          </div>
        </AppProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;