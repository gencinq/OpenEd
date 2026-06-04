import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './features/auth/AuthContext';
import MainLayout from './components/layout/MainLayout';
import AppRouter from './routes/AppRouter';

export const App: React.FC = () => {
  // Sync dark class on mount from local storage or system preference
  React.useEffect(() => {
    const isDark = localStorage.getItem('theme') === 'dark' || 
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  return (
    <Router>
      <AuthProvider>
        <MainLayout>
          <AppRouter />
        </MainLayout>
      </AuthProvider>
    </Router>
  );
};
export default App;
