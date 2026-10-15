import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../api';
import type { User, Session, UserPreferences } from '../types';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  updatePreferences: (prefs: Partial<UserPreferences>) => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is already authenticated on mount
  useEffect(() => {
    async function checkAuth() {
      try {
        const data = await authApi.me();
        setUser(data.user);
        setSession({
          id: 'active',
          userId: data.user.id,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date().toISOString(),
          lastActivity: new Date().toISOString(),
        });
      } catch {
        // Not authenticated
        setUser(null);
        setSession(null);
      } finally {
        setIsLoading(false);
      }
    }
    checkAuth();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setError(null);
    setIsLoading(true);
    
    try {
      const data = await authApi.login(email, password);
      setUser(data.user);
      setSession({
        id: 'active',
        userId: data.user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
      });
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (email: string, password: string, displayName: string) => {
    setError(null);
    setIsLoading(true);
    
    try {
      await authApi.register(email, password, displayName);
      // After registration, user needs to verify email before logging in
      // For development, we'll auto-login after registration
      // In production, this would require email verification first
      const loginData = await authApi.login(email, password);
      setUser(loginData.user);
      setSession({
        id: 'active',
        userId: loginData.user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
      });
    } catch (err: any) {
      setError(err.message || 'Error al registrar');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // Ignore errors on logout
    }
    setUser(null);
    setSession(null);
  }, []);

  const updateProfile = useCallback(async (data: Partial<User>) => {
    // In production, this would call PATCH /api/v1/auth/me
    // For now, update local state
    if (!user) return;
    const updated = { ...user, ...data, updatedAt: new Date().toISOString() };
    setUser(updated);
  }, [user]);

  const updatePreferences = useCallback(async (prefs: Partial<UserPreferences>) => {
    if (!user) return;
    const updated = { ...user, preferences: { ...user.preferences, ...prefs } };
    setUser(updated);
  }, [user]);

  const clearError = useCallback(() => setError(null), []);

  return (
    <AuthContext.Provider value={{
      user,
      session,
      isLoading,
      isAuthenticated: !!user && !!session,
      login,
      register,
      logout,
      updateProfile,
      updatePreferences,
      error,
      clearError,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
