import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

interface AuthContextValue {
  user: any;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthContextProvider');
  }
  return context;
};

export const AuthContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Check for token in localStorage on initial load
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await api.post('/users/login', { email, password });
<<<<<<< Updated upstream
      const { accessToken, user: userData } = response.data?.data ?? response.data;
=======
      const { accessToken, user: userData } = response.data.data;
>>>>>>> Stashed changes
      localStorage.setItem('token', accessToken);
      setToken(accessToken);
      setUser(userData);
      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || 'Login failed' };
    }
  };

  const register = async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await api.post('/users/register', { name, email, password });
<<<<<<< Updated upstream
      // Register only returns user; auto-login to get tokens
      const registeredUser = response.data?.data ?? response.data;
      if (!registeredUser?.accessToken) {
        const loginResp = await api.post('/users/login', { email, password });
        const { accessToken: at, user: u } = loginResp.data?.data ?? loginResp.data;
        localStorage.setItem('token', at);
        setToken(at);
        setUser(u);
        api.defaults.headers.common['Authorization'] = `Bearer ${at}`;
        return { success: true };
      }
      const { accessToken, user: userData } = registeredUser;
=======
      const { accessToken, user: userData } = response.data.data;
>>>>>>> Stashed changes
      localStorage.setItem('token', accessToken);
      setToken(accessToken);
      setUser(userData);
      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || 'Registration failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete api.defaults.headers.common['Authorization'];
  };

  const value: AuthContextValue = {
    user,
    token,
    login,
    register,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};