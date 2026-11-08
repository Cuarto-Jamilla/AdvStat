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
  const [remember, setRemember] = useState(true); const [recoveryNotice, setRecoveryNotice] = useState(false);

  useEffect(() => { if (ready && user) router.replace('/dashboard'); }, [ready, user, router]);
  useEffect(() => { const t = setInterval(() => setH((x) => (x + 1) % HELLOS.length), 2200); return () => clearInterval(t); }, []);
  useEffect(() => {
    try {
      const savedEmail = localStorage.getItem('advstat_remembered_email');
      if (savedEmail) setEmail(savedEmail);
    } catch {}
  }, []);

  const submit = async (e: FormEvent) => {
    e.preventDefault(); setBusy(true); setErr('');
    if (mode === 'in') {
      try {
        if (remember) localStorage.setItem('advstat_remembered_email', email);
        else localStorage.removeItem('advstat_remembered_email');
      } catch {}
    }
    const res = mode === 'in' ? await login(email, pw, remember) : await register(name, email, pw);
    setBusy(false);
    if (res) setErr(res); else router.replace('/dashboard');
  };

  return (
    <div className="auth">
      <button className="ghost corner" onClick={toggleTheme} aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'} title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>{theme === 'dark' ? <IconSun /> : <IconMoon />}</button>
      <section className="auth-showcase">
        <div className="auth-brand"><Logo size={42} /><span><b>ADVSTAT</b><small>Statistical Analysis Lab</small></span></div>
        <div className="auth-welcome">
          <p className="auth-kicker">A CLEARER VIEW OF YOUR DATA</p>
          <h1 key={h} className="hello">{HELLOS[h]}.</h1>
          <p>Welcome to your statistical workspace. Explore relationships, test assumptions, and make each result easier to understand.</p>
        </div>
        <div className="auth-illustration" aria-hidden="true">
          <div className="illustration-label"><span className="status-dot" /> DATA IN CONTEXT</div>
          <svg viewBox="0 0 520 230" className="heroart">
            <path d="M45 195H495M45 145H495M45 95H495M45 45H495M95 25V195M195 25V195M295 25V195M395 25V195" className="illustration-grid" />
            <path d="M45 180C100 171 116 150 157 158S222 127 262 132 323 91 359 103 417 57 495 40" className="heropath" />
            {[[87, 169], [147, 156], [200, 145], [248, 135], [300, 118], [353, 105], [408, 76], [461, 56]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="5" className="herodot" style={{ animationDelay: `${i * 0.1}s` }} />)}
            <path d="M45 188C130 186 148 158 203 136S276 84 327 100 407 50 495 38" className="illustration-secondary" />
          </svg>
          <div className="illustration-caption"><span>Regression</span><span>Hypothesis tests</span></div>
        </div>
        <p className="auth-footnote">Built for learning, exploration, and careful interpretation.</p>
      </section>
      <section className="auth-form-side">
        <form className="card authcard" onSubmit={submit}>
          <div className="form-heading"><p className="auth-kicker">{mode === 'in' ? 'YOUR WORKSPACE AWAITS' : 'START EXPLORING'}</p><h2>{mode === 'in' ? 'Sign in' : 'Create your account'}</h2><p>{mode === 'in' ? 'Continue with your ADVSTAT Studio account.' : 'Set up an account to save and revisit your analyses.'}</p></div>
          {mode === 'up' && <label>Name<input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" autoComplete="name" /></label>}
          <label>Email address<input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@school.edu" autoComplete="email" /></label>
          <label>Password<input required type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder={mode === 'in' ? 'Enter your password' : 'At least 6 characters'} autoComplete={mode === 'in' ? 'current-password' : 'new-password'} minLength={mode === 'up' ? 6 : undefined} /></label>
          {mode === 'in' && <div className="auth-options"><label className="remember-option"><input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />Remember me</label><button type="button" className="forgot-link" onClick={() => setRecoveryNotice((visible) => !visible)}>Forgot password?</button></div>}
          {recoveryNotice && mode === 'in' && <p className="recovery-note" role="status">Password reset is not available yet. Contact your course administrator for help.</p>}
          {err && <div className="error" role="alert">{err}</div>}
          <button className="primary auth-submit" disabled={busy}>{busy ? 'Please wait…' : mode === 'in' ? 'Login' : 'Create account'}</button>
          <p className="signup-prompt">{mode === 'in' ? 'New to ADVSTAT Studio?' : 'Already have an account?'} <button type="button" onClick={() => { setMode(mode === 'in' ? 'up' : 'in'); setErr(''); setRecoveryNotice(false); }}>{mode === 'in' ? 'Sign up' : 'Sign in'}</button></p>
        </form>
        <p className="auth-legal">ADVSTAT Studio <span>·</span> Statistical Analysis Lab</p>
      </section>
    </div>
  );
}
