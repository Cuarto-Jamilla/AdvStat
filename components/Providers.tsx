'use client';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

type User = { name: string; email: string };
type Theme = 'light' | 'dark';
interface Ctx {
  user: User | null; ready: boolean; theme: Theme; toggleTheme: () => void;
  login: (email: string, pw: string) => Promise<string | null>;
  register: (name: string, email: string, pw: string) => Promise<string | null>;
  logout: () => void;
}
const C = createContext<Ctx>(null as unknown as Ctx);
export const useApp = () => useContext(C);

async function hash(s: string) {
  const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  return Array.from(new Uint8Array(b)).map((x) => x.toString(16).padStart(2, '0')).join('');
}
type Stored = { name: string; email: string; pw: string };
const users = (): Stored[] => { try { return JSON.parse(localStorage.getItem('advstat_users') || '[]'); } catch { return []; } };

export default function Providers({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    try {
      const t = (localStorage.getItem('advstat_theme') as Theme) || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      setTheme(t);
      const s = localStorage.getItem('advstat_session');
      if (s) setUser(JSON.parse(s));
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem('advstat_theme', theme); } catch {}
  }, [theme]);

  const start = (u: User) => { setUser(u); localStorage.setItem('advstat_session', JSON.stringify(u)); };

  const register = async (name: string, email: string, pw: string) => {
    email = email.trim().toLowerCase();
    if (!name.trim() || !email.includes('@') || pw.length < 6) return 'Enter a name, a valid email and a password of 6+ characters.';
    const all = users();
    if (all.some((u) => u.email === email)) return 'That email is already registered. Try signing in.';
    all.push({ name: name.trim(), email, pw: await hash(pw) });
    localStorage.setItem('advstat_users', JSON.stringify(all));
    start({ name: name.trim(), email });
    return null;
  };
  const login = async (email: string, pw: string) => {
    email = email.trim().toLowerCase();
    const u = users().find((x) => x.email === email);
    if (!u || u.pw !== (await hash(pw))) return 'Incorrect email or password.';
    start({ name: u.name, email });
    return null;
  };
  const logout = () => { setUser(null); localStorage.removeItem('advstat_session'); };

  return <C.Provider value={{ user, ready, theme, toggleTheme: () => setTheme(theme === 'dark' ? 'light' : 'dark'), login, register, logout }}>{children}</C.Provider>;
}
