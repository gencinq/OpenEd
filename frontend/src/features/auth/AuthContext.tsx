import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginDTO, CreateUserDTO, UpdateUserDTO } from '@shared/types';
import { authService } from '../../services/auth.service';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (dto: LoginDTO) => Promise<void>;
  register: (dto: CreateUserDTO) => Promise<void>;
  logout: () => void;
  updateUser: (dto: UpdateUserDTO) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('opened_token'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const userData = await authService.getMe();
          setUser(userData);
        } catch (err) {
          console.error('Failed to load user with current token', err);
          logout();
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, [token]);

  const login = async (dto: LoginDTO) => {
    setIsLoading(true);
    try {
      const data = await authService.login(dto);
      localStorage.setItem('opened_token', data.token);
      setToken(data.token);
      setUser(data.user);
    } catch (err) {
      setIsLoading(false);
      throw err;
    }
  };

  const register = async (dto: CreateUserDTO) => {
    setIsLoading(true);
    try {
      const data = await authService.register(dto);
      localStorage.setItem('opened_token', data.token);
      setToken(data.token);
      setUser(data.user);
    } catch (err) {
      setIsLoading(false);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('opened_token');
    setToken(null);
    setUser(null);
    setIsLoading(false);
  };

  const updateUser = async (dto: UpdateUserDTO) => {
    if (!user) return;
    try {
      const updatedUser = await authService.updateProfile(user.id, dto);
      setUser(updatedUser);
    } catch (err) {
      console.error('Failed to update user profile', err);
      throw err;
    }
  };

  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
