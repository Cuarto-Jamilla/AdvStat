'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/components/Providers';
import { Logo } from '@/components/Icons';

export default function Root() {
  const { user, ready } = useApp();
  const router = useRouter();
  useEffect(() => { if (ready) router.replace(user ? '/dashboard' : '/login'); }, [ready, user, router]);
  return <div className="splash"><Logo size={64} /></div>;
}
