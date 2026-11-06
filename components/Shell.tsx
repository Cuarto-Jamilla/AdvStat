'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';
import { useApp } from './Providers';
import { Logo, IconHome, IconRegression, IconHypo, IconBook, IconSun, IconMoon, IconLogout, IconUser } from './Icons';

const NAV = [
  { href: '/dashboard', label: 'Home', Icon: IconHome },
  { href: '/regression', label: 'Regression Lab', Icon: IconRegression },
  { href: '/hypothesis', label: 'Hypothesis Arena', Icon: IconHypo },
  { href: '/guide', label: 'User Manual', Icon: IconBook },
];

export default function Shell({ children }: { children: ReactNode }) {
  const { user, ready, theme, toggleTheme, logout } = useApp();
  const router = useRouter();
  const path = usePathname();
  useEffect(() => { if (ready && !user) router.replace('/login'); }, [ready, user, router]);
  if (!ready || !user) return <div className="splash"><Logo size={64} /></div>;
  return (
    <div className="shell">
      <aside className="side">
        <div className="brand"><Logo size={38} /><div><b>ADVSTAT</b><small>Studio</small></div></div>
        <nav>
          {NAV.map(({ href, label, Icon }) => (
            <Link key={href} href={href} className={path === href ? 'nav on' : 'nav'}><Icon /><span>{label}</span></Link>
          ))}
        </nav>
        <div className="side-foot">
          <div className="me"><IconUser /><span>{user.name}</span></div>
          <button className="ghost" onClick={toggleTheme}>{theme === 'dark' ? <IconSun /> : <IconMoon />}<span>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span></button>
          <button className="ghost" onClick={() => { logout(); router.replace('/login'); }}><IconLogout /><span>Log out</span></button>
        </div>
      </aside>
      <main className="main">{children}</main>
    </div>
  );
}
