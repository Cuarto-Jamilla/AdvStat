'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';
import { useApp } from './Providers';
import { Logo, IconHome, IconRegression, IconHypo, IconHistory, IconBookmark, IconInfo, IconSun, IconMoon, IconLogout, IconUser, IconBook } from './Icons';

const NAV = [
  { href: '/dashboard', label: 'Dashboard', Icon: IconHome },
  { href: '/regression', label: 'Linear Regression', Icon: IconRegression },
  { href: '/hypothesis', label: 'Hypothesis Testing', Icon: IconHypo },
  { href: '/history', label: 'History', Icon: IconHistory },
  { href: '/saved', label: 'Saved Results', Icon: IconBookmark },
  { href: '/account', label: 'Account', Icon: IconUser },
  { href: '/review', label: 'Review Topics', Icon: IconBook },
  { href: '/guide', label: 'About', Icon: IconInfo },
];

export default function Shell({ children }: { children: ReactNode }) {
  const { user, ready, theme, toggleTheme, logout } = useApp();
  const router = useRouter();
  const path = usePathname();
  useEffect(() => { if (ready && !user) router.replace('/login'); }, [ready, user, router]);
  if (!ready || !user) return null;
  return (
    <div className="shell">
      <aside className="side">
        <Link href="/dashboard" className="brand"><Logo size={38} /><div><b>ADVSTAT</b><small>Studio</small></div></Link>
        <nav>
          {NAV.map(({ href, label, Icon }) => (
            <Link key={href} href={href} className={path === href ? 'nav on' : 'nav'}><Icon /><span>{label}</span></Link>
          ))}
        </nav>
        <div className="side-foot">
          <Link className="me account-shortcut" href="/account">{user.profilePicture ? <img src={user.profilePicture} alt="" /> : <IconUser />}<span>{user.name}</span></Link>
          <button className="ghost theme-toggle" onClick={toggleTheme} aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'} title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>{theme === 'dark' ? <IconSun /> : <IconMoon />}<span>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span></button>
          <button className="ghost" onClick={() => { logout(); router.replace('/login'); }}><IconLogout /><span>Log out</span></button>
        </div>
      </aside>
      <main className="main">{children}</main>
    </div>
  );
}
