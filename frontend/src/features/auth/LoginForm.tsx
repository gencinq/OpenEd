import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { KeyRound, Mail, AlertCircle } from 'lucide-react';
import GoogleAuthButton from './GoogleAuthButton';

interface LoginFormProps {
  onSuccess: () => void;
  onToggleForm: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onToggleForm }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both email and password');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      await login({ email, password });
      onSuccess();
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-foreground text-center">Welcome back</h2>
        <p className="text-sm text-muted-foreground text-center">Login to your account to start sharing notes</p>
      </div>

      {errorMsg && (
        <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-md">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-muted-foreground" htmlFor="login-email">Email</label>
          <div className="relative">
            <input
              id="login-email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-9 pl-9 pr-3 rounded-md border border-input bg-card text-sm focus:outline-none"
              required
            />
            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-muted-foreground" htmlFor="login-password">Password</label>
          <div className="relative">
            <input
              id="login-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-9 pl-9 pr-3 rounded-md border border-input bg-card text-sm focus:outline-none"
              required
            />
            <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-9 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition-colors flex items-center justify-center disabled:opacity-50"
        >
          {isSubmitting ? 'Logging in...' : 'Log In'}
        </button>
      </form>

      <div className="relative flex items-center justify-center my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <span className="relative bg-card px-2 text-xs text-muted-foreground uppercase font-semibold">Or continue with</span>
      </div>

      <GoogleAuthButton />

      <p className="text-center text-sm text-muted-foreground">
        Don't have an account?{' '}
        <button onClick={onToggleForm} className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold">
          Sign Up
        </button>
      </p>
    </div>
  );
};
export default LoginForm;
