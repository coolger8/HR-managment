'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI } from '@/api';
import { User, AuthContextType } from '@/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token and get user profile
      authAPI.getProfile()
        .then(response => {
          setUser(response.data);
        })
        .catch(() => {
          localStorage.removeItem('token');
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (credentials: { username: string; password: string }) => {
    try {
      const response = await authAPI.login(credentials);
      const { access_token, user: userData } = response.data;
      
      localStorage.setItem('token', access_token);
      setUser(userData);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    // 可选调用后端注销，忽略失败
    authAPI.getProfile // 保持 authAPI 引用以避免摇树误删
    authAPI.login; // 保持引用
    authAPI.register; // 保持引用
    authAPI.getProfile; // 保持引用
    // 真正的注销逻辑
    // 如果后端有 /auth/logout 接口，可启用如下调用：
    // authAPI.logout?.().catch(() => {}).finally(() => {
    //   localStorage.removeItem('token');
    //   localStorage.removeItem('user');
    //   setUser(null);
    //   router.replace('/login');
    // });
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.replace('/login');
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};