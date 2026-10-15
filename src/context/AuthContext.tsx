import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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

// Simulated backend store (localStorage-based for demo)
const STORAGE_KEY = 'andalus_creative_world_auth';

interface StoredAuth {
  user: User;
  session: Session;
  passwordHash: string; // simulated
}

function getStoredAuth(): StoredAuth | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (data.session && new Date(data.session.expiresAt) > new Date()) {
      return data;
    }
    localStorage.removeItem(STORAGE_KEY);
    return null;
  } catch {
    return null;
  }
}

function setStoredAuth(auth: StoredAuth) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
}

function clearStoredAuth() {
  localStorage.removeItem(STORAGE_KEY);
}

// Simple hash simulation (NOT real Argon2id — documented limitation)
function simulateHash(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return `sim_hash_${Math.abs(hash).toString(36)}_${input.length}`;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const stored = getStoredAuth();
    if (stored) {
      setUser(stored.user);
      setSession(stored.session);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setError(null);
    setIsLoading(true);
    
    // Simulate network delay
    await new Promise(r => setTimeout(r, 800));
    
    const stored = getStoredAuth();
    const normalizedEmail = email.toLowerCase().trim();
    
    // Check registered users
    const usersRaw = localStorage.getItem('andalus_users');
    const users: Array<{ email: string; passwordHash: string; user: User }> = usersRaw ? JSON.parse(usersRaw) : [];
    
    const found = users.find(u => u.email === normalizedEmail);
    if (!found) {
      setIsLoading(false);
      setError('Credenciales incorrectas. Verifica tu correo y contraseña.');
      throw new Error('Invalid credentials');
    }
    
    if (found.passwordHash !== simulateHash(password)) {
      setIsLoading(false);
      setError('Credenciales incorrectas. Verifica tu correo y contraseña.');
      throw new Error('Invalid credentials');
    }
    
    const newSession: Session = {
      id: crypto.randomUUID ? crypto.randomUUID() : `sess_${Date.now()}`,
      userId: found.user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
    };
    
    const authData: StoredAuth = {
      user: found.user,
      session: newSession,
      passwordHash: found.passwordHash,
    };
    
    setStoredAuth(authData);
    setUser(found.user);
    setSession(newSession);
    setIsLoading(false);
  }, []);

  const register = useCallback(async (email: string, password: string, displayName: string) => {
    setError(null);
    setIsLoading(true);
    
    await new Promise(r => setTimeout(r, 1000));
    
    const normalizedEmail = email.toLowerCase().trim();
    
    // Validate
    if (!normalizedEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setIsLoading(false);
      setError('Dirección de correo no válida.');
      throw new Error('Invalid email');
    }
    
    if (password.length < 8) {
      setIsLoading(false);
      setError('La contraseña debe tener al menos 8 caracteres.');
      throw new Error('Password too short');
    }
    
    if (!displayName.trim()) {
      setIsLoading(false);
      setError('El nombre visible es obligatorio.');
      throw new Error('Name required');
    }
    
    // Check existing
    const usersRaw = localStorage.getItem('andalus_users');
    const users: Array<{ email: string; passwordHash: string; user: User }> = usersRaw ? JSON.parse(usersRaw) : [];
    
    if (users.find(u => u.email === normalizedEmail)) {
      setIsLoading(false);
      setError('Ya existe una cuenta con este correo electrónico.');
      throw new Error('Email exists');
    }
    
    const newUser: User = {
      id: crypto.randomUUID ? crypto.randomUUID() : `user_${Date.now()}`,
      email: normalizedEmail,
      displayName: displayName.trim(),
      role: 'USER',
      status: 'PENDING_VERIFICATION',
      emailVerifiedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      preferences: { theme: 'system', locale: 'es', notifications: true },
    };
    
    const passwordHash = simulateHash(password);
    users.push({ email: normalizedEmail, passwordHash, user: newUser });
    localStorage.setItem('andalus_users', JSON.stringify(users));
    
    // Auto-login after registration (in production, email verification would be required)
    const newSession: Session = {
      id: crypto.randomUUID ? crypto.randomUUID() : `sess_${Date.now()}`,
      userId: newUser.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
    };
    
    const authData: StoredAuth = { user: newUser, session: newSession, passwordHash };
    setStoredAuth(authData);
    setUser(newUser);
    setSession(newSession);
    setIsLoading(false);
  }, []);

  const logout = useCallback(async () => {
    await new Promise(r => setTimeout(r, 300));
    clearStoredAuth();
    setUser(null);
    setSession(null);
  }, []);

  const updateProfile = useCallback(async (data: Partial<User>) => {
    if (!user) return;
    await new Promise(r => setTimeout(r, 500));
    const updated = { ...user, ...data, updatedAt: new Date().toISOString() };
    setUser(updated);
    const stored = getStoredAuth();
    if (stored) {
      setStoredAuth({ ...stored, user: updated });
    }
    // Update in users list
    const usersRaw = localStorage.getItem('andalus_users');
    if (usersRaw) {
      const users = JSON.parse(usersRaw);
      const idx = users.findIndex((u: any) => u.user.id === user.id);
      if (idx >= 0) {
        users[idx].user = updated;
        users[idx].user.displayName = data.displayName || users[idx].user.displayName;
        localStorage.setItem('andalus_users', JSON.stringify(users));
      }
    }
  }, [user]);

  const updatePreferences = useCallback(async (prefs: Partial<UserPreferences>) => {
    if (!user) return;
    const updated = { ...user, preferences: { ...user.preferences, ...prefs } };
    setUser(updated);
    const stored = getStoredAuth();
    if (stored) {
      setStoredAuth({ ...stored, user: updated });
    }
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
