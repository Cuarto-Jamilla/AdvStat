import { NextRequest } from 'next/server';
import { compare, hash } from 'bcryptjs';
import { getSessionUser } from '@/lib/auth';
import { getProfilesSql } from '@/lib/records';

export async function PATCH(request: NextRequest) {
  const user = await getSessionUser(request);
  if (!user) return Response.json({ message: 'Please sign in.' }, { status: 401 });

  try {
    const body = await request.json();
    const newPassword = String(body.newPassword || '');
    const currentPassword = String(body.currentPassword || '');
    const hasPicture = Object.prototype.hasOwnProperty.call(body, 'profilePicture');
    const profilePicture = body.profilePicture;

    if (newPassword && newPassword.length < 6) {
      return Response.json({ message: 'New password must be at least 6 characters.' }, { status: 400 });
    }
    if (newPassword && !currentPassword) {
      return Response.json({ message: 'Enter your current password to change it.' }, { status: 400 });
    }
    if (hasPicture && profilePicture !== null && (typeof profilePicture !== 'string' || !/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(profilePicture) || profilePicture.length > 1400000)) {
      return Response.json({ message: 'Choose a PNG, JPEG, or WebP image smaller than 1 MB.' }, { status: 400 });
    }

    const sql = await getProfilesSql();
    if (newPassword) {
      const accounts = await sql`SELECT password_hash FROM users WHERE id = ${user.id} LIMIT 1`;
      if (!accounts[0] || !(await compare(currentPassword, accounts[0].password_hash))) {
        return Response.json({ message: 'Current password is incorrect.' }, { status: 401 });
      }
      await sql`UPDATE users SET password_hash = ${await hash(newPassword, 12)} WHERE id = ${user.id}`;
    }
    if (hasPicture) {
      await sql`
        INSERT INTO user_profiles (user_id, profile_picture, updated_at)
        VALUES (${user.idText}, ${profilePicture}, NOW())
        ON CONFLICT (user_id) DO UPDATE SET profile_picture = EXCLUDED.profile_picture, updated_at = NOW()
      `;
    }

    return Response.json({ success: true, profilePicture: hasPicture ? profilePicture : undefined });
  } catch (error) {
    console.error('Account update failed:', error);
    return Response.json({ message: 'Unable to update account settings.' }, { status: 500 });
  }
}