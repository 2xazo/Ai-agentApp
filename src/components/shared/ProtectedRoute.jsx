import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useEffect } from 'react';

export default function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Log authentication state for debugging
    console.log('ProtectedRoute - Auth State:', {
      currentUser: currentUser ? 'Logged in' : 'Not logged in',
      loading,
      path: location.pathname
    });
  }, [currentUser, loading, location]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!currentUser) {
    // Save the attempted URL for redirecting after login
    const from = location.pathname;
    console.log('Redirecting to login from:', from);
    return <Navigate to="/" state={{ from }} replace />;
  }

  return children;
} 