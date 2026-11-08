import { getSql } from '@/lib/db';
import { getProfilesSql } from '@/lib/records';
import { compare } from 'bcryptjs';
import { SignJWT } from 'jose';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email || '').trim().toLowerCase();
    const password = String(body.password || '');
    const remember = body.remember !== false;

    if (!email || !password) {
      return Response.json(
        { success: false, message: 'Please enter your email and password.' },
        { status: 400 }
      );
    }

    const secret = process.env.AUTH_SECRET;
    if (!secret) {
      throw new Error('AUTH_SECRET is not configured.');
    }

    const sql = getSql();
    const users = await sql`
      SELECT id, name, email, password_hash
      FROM users
      WHERE email = ${email}
      LIMIT 1
    `;

    const account = users[0];

    if (!account || !(await compare(password, account.password_hash))) {
      return Response.json(
        { success: false, message: 'Incorrect email or password.' },
        { status: 401 }
      );
    }

    let profilePicture: string | null = null;
    try {
      const profileSql = await getProfilesSql();
      const profiles = await profileSql`SELECT profile_picture FROM user_profiles WHERE user_id = ${String(account.id)} LIMIT 1`;
      profilePicture = profiles[0]?.profile_picture || null;
    } catch (error) {
      console.error('Profile lookup failed:', error);
    }

    const token = await new SignJWT({
      userId: account.id,
      email: account.email,
      name: account.name,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(new TextEncoder().encode(secret));

    const response = Response.json({
      success: true,
      message: 'Login successful!',
      user: {
        id: account.id,
        name: account.name,
        email: account.email,
        profilePicture,
      },
    });

    response.headers.append(
      'Set-Cookie',
      `advstat_session=${token}; HttpOnly; Path=/; SameSite=Lax${remember ? '; Max-Age=604800' : ''}${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`
    );

    return response;
  } catch (error) {
    console.error('Login error:', error);

    return Response.json(
      { success: false, message: 'Login failed. Please try again.' },
      { status: 500 }
    );
  }
}