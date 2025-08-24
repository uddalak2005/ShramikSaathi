import { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Create context
const AuthContext = createContext({});

const initialState = {
  isLoggedIn: false,
  userName: '',
  role: '',
};

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(initialState);

  // Initialize auth from localStorage
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('authUser');
    if (token && userData) {
      setAuth(JSON.parse(userData));
    }
  }, []);

  const login = useCallback(async (credentials) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) throw new Error('Login failed');

      const data = await response.json();

      const userAuth = {
        isLoggedIn: true,
        userName: data.userExist.name || '',
        role: data.userExist.role || '',
      };

      setAuth(userAuth);

      // Persist token and user info
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('authUser', JSON.stringify(userAuth));

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, []);

  const logout = useCallback(() => {
    setAuth(initialState);
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
  }, []);

  const value = {
    ...auth,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}

export default AuthContext;
