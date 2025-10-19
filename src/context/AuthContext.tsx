import { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  is_validated: boolean;
  token: string;
  name?: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (data: User) => {
    setUser(data);
    localStorage.setItem('token', data.token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  const updateUser = (userData: Partial<User>) => {
    setUser((prevUser) => (prevUser ? { ...prevUser, ...userData } : null));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        updateUser,
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
