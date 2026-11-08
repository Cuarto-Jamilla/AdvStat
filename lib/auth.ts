import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export type SessionUser = {
  id: string | number;
  idText: string;
  name: string;
  email: string;
};

export async function getSessionUser(request: NextRequest): Promise<SessionUser | null> {
  const token = request.cookies.get('advstat_session')?.value;
  const secret = process.env.AUTH_SECRET;
  if (!token || !secret) return null;

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    if (typeof payload.userId !== 'string' && typeof payload.userId !== 'number') return null;
    return {
      id: payload.userId,
      idText: String(payload.userId),
      name: String(payload.name || ''),
      email: String(payload.email || ''),
    };
  } catch {
    return null;
  }
}