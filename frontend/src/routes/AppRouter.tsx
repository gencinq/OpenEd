import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import ExplorePage from '../pages/ExplorePage';
import NotePage from '../pages/NotePage';
import StudyGuidePage from '../pages/StudyGuidePage';
import QuestionPage from '../pages/QuestionPage';
import Dashboard from '../pages/Dashboard';
import ProfilePage from '../pages/ProfilePage';
import ProtectedRoute from './ProtectedRoute';
import { useAuth } from '../hooks/useAuth';

// Callback page for Google OAuth redirection callback
const GoogleAuthCallback: React.FC = () => {
  const { isLoading } = useAuth();
  const location = window.location;

  React.useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (token) {
      localStorage.setItem('opened_token', token);
      // Reload page to re-trigger auth provider check
      window.location.href = '/dashboard';
    } else if (error) {
      alert(`Authentication failed: ${error}`);
      window.location.href = '/';
    }
  }, [location]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-indigo-600 mb-4" />
      <h2 className="text-lg font-bold text-foreground">Completing Google authentication...</h2>
      <p className="text-sm text-muted-foreground">Please wait while we log you in.</p>
    </div>
  );
};

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/explore" element={<ExplorePage />} />
      <Route path="/notes/:id" element={<NotePage />} />
      <Route path="/guides/:id" element={<StudyGuidePage />} />
      <Route path="/questions/:id" element={<QuestionPage />} />
      
      {/* Protected Pages */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile/:id"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      
      {/* Google OAuth Callback Handler */}
      <Route path="/auth/callback" element={<GoogleAuthCallback />} />
      
      {/* Fallback Redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
export default AppRouter;
