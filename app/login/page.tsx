'use client';
import { useEffect, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/components/Providers';
import { Logo, IconSun, IconMoon } from '@/components/Icons';

const HELLOS = ['Hello', 'Kumusta', 'Hola', 'Bonjour', 'Konnichiwa', 'Ciao'];

export default function Login() {
  const { user, ready, login, register, theme, toggleTheme } = useApp();
  const router = useRouter();
  const [mode, setMode] = useState<'in' | 'up'>('in');
  const [name, setName] = useState(''); const [email, setEmail] = useState(''); const [pw, setPw] = useState('');
  const [err, setErr] = useState(''); const [busy, setBusy] = useState(false); const [h, setH] = useState(0);

  useEffect(() => { if (ready && user) router.replace('/dashboard'); }, [ready, user, router]);
  useEffect(() => { const t = setInterval(() => setH((x) => (x + 1) % HELLOS.length), 2200); return () => clearInterval(t); }, []);

  const submit = async (e: FormEvent) => {
    e.preventDefault(); setBusy(true); setErr('');
    const res = mode === 'in' ? await login(email, pw) : await register(name, email, pw);
    setBusy(false);
    if (res) setErr(res); else router.replace('/dashboard');
  };

  return (
    <div className="auth">
      <button className="ghost corner" onClick={toggleTheme} aria-label="Toggle theme">{theme === 'dark' ? <IconSun /> : <IconMoon />}</button>
      <section className="hero">
        <Logo size={72} />
        <h1 key={h} className="hello">{HELLOS[h]}!<span className="wave">👋</span></h1>
        <p>Welcome to <b>ADVSTAT Studio</b> — your playground for regression lines, correlations and hypothesis tests.</p>
        <svg viewBox="0 0 300 120" className="heroart" aria-hidden>
          <path d="M10 110 C80 110 90 12 150 12 S220 110 290 110" className="heropath" />
          {[40, 75, 110, 150, 190, 225, 260].map((x, i) => <circle key={x} cx={x} cy={100 - [8, 40, 80, 98, 78, 38, 6][i]} r="4" className="herodot" style={{ animationDelay: `${i * 0.15}s` }} />)}
        </svg>
      </section>
      <form className="card authcard" onSubmit={submit}>
        <div className="tabs">
          <button type="button" className={mode === 'in' ? 'tab on' : 'tab'} onClick={() => { setMode('in'); setErr(''); }}>Sign in</button>
          <button type="button" className={mode === 'up' ? 'tab on' : 'tab'} onClick={() => { setMode('up'); setErr(''); }}>Create account</button>
        </div>
        {mode === 'up' && <label>Name<input value={name} onChange={(e) => setName(e.target.value)} placeholder="Juan Dela Cruz" autoComplete="name" /></label>}
        <label>Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@school.edu" autoComplete="email" /></label>
        <label>Password<input type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="At least 6 characters" autoComplete={mode === 'in' ? 'current-password' : 'new-password'} /></label>
        {err && <div className="error">{err}</div>}
        <button className="primary" disabled={busy}>{busy ? 'Please wait…' : mode === 'in' ? 'Sign in' : 'Register & start'}</button>
      </form>
    </div>
  );
}
