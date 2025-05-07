// src/App.jsx (updated)
import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import Layout from './components/shared/Layout';
import Home from './pages/Home';
import { useAuth } from './context/AuthContext';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ChatPage from './pages/ChatPage';
import TranscriptionPage from './pages/TranscriptionPage';
import Profile from './pages/Profile';

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
              <Route path="/" element={<Home />} />
              <Route
                path="/chat"
                element={
                  <ProtectedRoute>
                    <Layout theme={theme} setTheme={setTheme}>
                      <ChatPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/transcribe"
                element={
                  <ProtectedRoute>
                    <Layout theme={theme} setTheme={setTheme}>
                      <TranscriptionPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Layout theme={theme} setTheme={setTheme}>
                      <Profile />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
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

function ProtectedRoute({ children }) {
  const { currentUser, loading, error } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Error</h2>
          <p className="text-gray-600 dark:text-gray-400">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default App;