import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

import type { UserProfile } from '@/services/auth.service';
import { authService } from '@/services/auth.service';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isVerified: boolean;
  profileCompleted: boolean;
  loading: boolean;
  login: (userData: UserProfile, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  updateUser: (userData: Partial<UserProfile>) => void;
  refreshProfile: () => Promise<void>;
  onLoginSuccess?: () => void;
  setOnLoginSuccess: (callback: (() => void) | undefined) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [onLoginSuccess, setOnLoginSuccess] = useState<(() => void) | undefined>(undefined);

  useEffect(() => {
    const initAuth = async () => {
      const token = authService.getAccessToken();
      if (token) {
        try {
          const profile = await authService.getProfile();
          setUser(profile);
        } catch {
          authService.clearTokens();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = (data: UserProfile, accessToken: string, refreshToken: string) => {
    setUser(data);
    authService.setTokens(accessToken, refreshToken);
    if (onLoginSuccess) {
      onLoginSuccess();
    }
  };

  const logout = () => {
    setUser(null);
    authService.clearTokens();
  };

  const updateUser = (userData: Partial<UserProfile>) => {
    setUser((prevUser) => (prevUser ? { ...prevUser, ...userData } : null));
  };

  const refreshProfile = async () => {
    try {
      const profile = await authService.getProfile();
      setUser(profile);
    } catch (error) {
      logout();
      throw error;
    }
  };

  const isVerified = user?.is_verified || false;
  const profileCompleted =
    isVerified &&
    !!user?.first_name &&
    !!user?.last_name &&
    !!user?.national_code &&
    !!user?.phone_number &&
    !!user?.gender;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isVerified,
        profileCompleted,
        loading,
        login,
        logout,
        updateUser,
        refreshProfile,
        onLoginSuccess,
        setOnLoginSuccess,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
