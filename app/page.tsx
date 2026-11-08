'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/components/Providers';

export default function Root() {
  const { user, ready } = useApp();
  const router = useRouter();
  useEffect(() => { if (ready) router.replace(user ? '/dashboard' : '/login'); }, [ready, user, router]);
  return null;
}
