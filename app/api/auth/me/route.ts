import { NextRequest } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { getProfilesSql } from '@/lib/records';

export async function GET(request: NextRequest) {
  const user = await getSessionUser(request);
  if (!user) return Response.json({ success: false, user: null }, { status: 401 });

  let profilePicture: string | null = null;
  try {
    const sql = await getProfilesSql();
    const profiles = await sql`SELECT profile_picture FROM user_profiles WHERE user_id = ${user.idText} LIMIT 1`;
    profilePicture = profiles[0]?.profile_picture || null;
  } catch (error) {
    console.error('Profile lookup failed:', error);
  }

  return Response.json({
    success: true,
    user: { id: user.idText, name: user.name, email: user.email, profilePicture },
  });
}