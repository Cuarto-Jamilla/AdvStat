
'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

type User = {
  id?: string;
  name: string;
  email: string;
  profilePicture?: string | null;
};

type Theme = 'light' | 'dark';

interface Ctx {
  user: User | null;
  ready: boolean;
  theme: Theme;
  toggleTheme: () => void;
  login: (email: string, pw: string, remember?: boolean) => Promise<string | null>;
  register: (name: string, email: string, pw: string) => Promise<string | null>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
}

const C = createContext<Ctx>(null as unknown as Ctx);

export const useApp = () => useContext(C);

export default function Providers({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [theme, setTheme] = useState<Theme>('dark');

  // Check existing login session
  useEffect(() => {
    let active = true;

    async function initialize() {
      try {
        const savedTheme = localStorage.getItem('advstat_theme');

        const initialTheme: Theme =
          savedTheme === 'light' || savedTheme === 'dark'
            ? savedTheme
            : 'dark';

        if (active) setTheme(initialTheme);

        const response = await fetch('/api/auth/me', {
          method: 'GET',
          credentials: 'include',
          cache: 'no-store',
        });

        if (response.ok) {
          const data = await response.json();

          if (active && data.success && data.user) {
            setUser(data.user);
          }
        }
      } catch (error) {
        console.error('Session check failed:', error);
      } finally {
        if (active) setReady(true);
      }
    }

    initialize();

    return () => {
      active = false;
    };
  }, []);

  // Save theme preference
  useEffect(() => {
    document.documentElement.dataset.theme = theme;

    try {
      localStorage.setItem('advstat_theme', theme);
    } catch {}
  }, [theme]);

  // Register using Neon database
  const register = async (
    name: string,
    email: string,
    pw: string
  ): Promise<string | null> => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name,
          email,
          password: pw,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        return data.message || 'Registration failed.';
      }

      // Automatically log in after successful registration
      return await login(email, pw);
    } catch (error) {
      console.error('Registration request failed:', error);
      return 'Unable to connect to the server. Please try again.';
    }
  };

  // Login using Neon database
  const login = async (
    email: string,
    pw: string,
    remember = true
  ): Promise<string | null> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email,
          password: pw,
          remember,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        return data.message || 'Incorrect email or password.';
      }

      setUser(data.user);
      return null;
    } catch (error) {
      console.error('Login request failed:', error);
      return 'Unable to connect to the server. Please try again.';
    }
  };

  // Logout and clear server session
  const logout = async (): Promise<void> => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout request failed:', error);
    } finally {
      setUser(null);
    }
  };

  // Toggle light and dark theme
  const toggleTheme = () => {
    setTheme((current) =>
      current === 'dark' ? 'light' : 'dark'
    );
  };

  return (
    <C.Provider
      value={{
        user,
        ready,
        theme,
        toggleTheme,
        login,
        register,
        logout,
        updateUser: (updates) => setUser((current) => current ? { ...current, ...updates } : current),
      }}
    >
      {children}
    </C.Provider>
  );
}
