import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';

import { apiRequest } from '../lib/api';
import { clearSession, getStoredToken, setSession } from '../lib/session';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const bootstrapSession = async () => {
      const storedToken = getStoredToken();

      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await apiRequest('/auth/me', {
          token: storedToken,
        });

        setToken(storedToken);
        setUser(response.data.user);
        setProfile(response.data.profile || null);
      } catch (_error) {
        clearSession();
      } finally {
        setIsLoading(false);
      }
    };

    bootstrapSession();
  }, []);

  const handleAuthSuccess = (payload) => {
    setSession(payload.token, payload.user);
    setToken(payload.token);
    setUser(payload.user);
    setProfile(payload.profile || null);
    return payload.user;
  };

  const refreshSession = async (overrideToken) => {
    const activeToken = overrideToken || token || getStoredToken();

    if (!activeToken) {
      return null;
    }

    const response = await apiRequest('/auth/me', {
      token: activeToken,
    });

    setToken(activeToken);
    setUser(response.data.user);
    setProfile(response.data.profile || null);

    return response.data;
  };

  const login = async (credentials) => {
    setIsLoading(true);

    try {
      const response = await apiRequest('/auth/login', {
        method: 'POST',
        body: credentials,
      });

      return handleAuthSuccess(response.data);
    } finally {
      setIsLoading(false);
    }
  };

  const registerBuyer = async (payload) => {
    setIsLoading(true);

    try {
      const response = await apiRequest('/auth/register/buyer', {
        method: 'POST',
        body: payload,
      });

      return handleAuthSuccess(response.data);
    } finally {
      setIsLoading(false);
    }
  };

  const registerSeller = async (payload) => {
    setIsLoading(true);

    try {
      const response = await apiRequest('/auth/register/seller', {
        method: 'POST',
        body: payload,
      });

      return handleAuthSuccess(response.data);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    const currentToken = token || getStoredToken();

    try {
      if (currentToken) {
        await apiRequest('/auth/logout', {
          method: 'POST',
          token: currentToken,
        });
      }
    } catch (_error) {
      // Local session cleanup still matters even if the network request fails.
    } finally {
      clearSession();
      setToken(null);
      setUser(null);
      setProfile(null);
      router.push('/login');
    }
  };

  const value = useMemo(
    () => ({
      user,
      profile,
      token,
      isLoading,
      isAuthenticated: Boolean(user && token),
      login,
      registerBuyer,
      registerSeller,
      logout,
      refreshSession,
    }),
    [isLoading, profile, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
