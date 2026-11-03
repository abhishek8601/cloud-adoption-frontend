

import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';

type User = {
  id?: number;
  name?: string;
  email?: string;
  phone?: string;
  company_name?: string;
  designation?: string;
  city?: string;
  state?: string;
  area_of_interest?: string;
  linkedin_url?: string;
  remarks?: string;
  role?: string;
  token?: string;
  status?: string;
  conference_id?: number;
  conference_title?: string;
  ticket_reference?: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (user: User) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: Partial<User>) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Try to load AsyncStorage if available, otherwise use memory storage
let AsyncStorage: any;
try {
  AsyncStorage = require('@react-native-async-storage/async-storage').default;
} catch {
  // Fallback if AsyncStorage is not installed
  AsyncStorage = {
    getItem: async (key: string) => null,
    setItem: async (key: string, value: string) => { },
    removeItem: async (key: string) => { },
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from storage on app start
  /**
   * The API returns `role` as `{ id, name }` but the app treats `user.role` as a
   * string everywhere. Profile screens spread raw API responses into updateUser(),
   * so normalise here once instead of guarding in every screen.
   */
  const normalizeUser = (data: Partial<User> | null | undefined): User => {
    const raw = (data ?? {}) as Record<string, unknown>;
    const role = raw.role;
    const roleName =
      typeof role === 'string'
        ? role
        : role && typeof role === 'object' && typeof (role as { name?: unknown }).name === 'string'
          ? (role as { name: string }).name
          : undefined;
    return { ...(data as User), role: roleName };
  };

  useEffect(() => {
    const restoreUser = async () => {
      try {
        if (AsyncStorage?.getItem) {
          const savedUser = await AsyncStorage.getItem('user');
          if (savedUser) {
            setUser(normalizeUser(JSON.parse(savedUser)));
          }
        }
      } catch (error) {
        console.error('Failed to restore user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    restoreUser();
  }, []);

  const login = async (data: User) => {
    const userData = normalizeUser(data);
    try {
      if (AsyncStorage?.setItem) {
        await AsyncStorage.setItem('user', JSON.stringify(userData));
      }
      setUser(userData);
    } catch (error) {
      console.error('Failed to save user:', error);
      setUser(userData); // Still set user even if storage fails
    }
  };

  const logout = async () => {
    try {
      if (AsyncStorage?.removeItem) {
        await AsyncStorage.removeItem('user');
      }
      setUser(null);
    } catch (error) {
      console.error('Failed to logout:', error);
      setUser(null); // Still logout even if storage fails
    }
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!user) return;
    const updatedUser = normalizeUser({ ...user, ...updates });
    try {
      if (AsyncStorage?.setItem) {
        await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      }
      setUser(updatedUser);
    } catch (error) {
      console.error('Failed to update user:', error);
      setUser(updatedUser); // Still update even if storage fails
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
