import { getSql } from '@/lib/db';
import { hash } from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name = String(body.name || '').trim();
    const email = String(body.email || '').trim().toLowerCase();
    const password = String(body.password || '');

    if (!name || !email || !password) {
      return Response.json(
        { success: false, message: 'Please complete all fields.' },
        { status: 400 }
      );
    }

    if (!email.includes('@')) {
      return Response.json(
        { success: false, message: 'Please enter a valid email.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return Response.json(
        { success: false, message: 'Password must be at least 6 characters.' },
        { status: 400 }
      );
    }

    const passwordHash = await hash(password, 12);
    const sql = getSql();

    await sql`
      INSERT INTO users (name, email, password_hash)
      VALUES (${name}, ${email}, ${passwordHash})
    `;

    return Response.json(
      { success: true, message: 'Account registered successfully!' },
      { status: 201 }
    );
  } catch (error) {
    const dbError = error as { code?: string };

    if (dbError.code === '23505') {
      return Response.json(
        { success: false, message: 'This email is already registered.' },
        { status: 409 }
      );
    }

    console.error('Registration error:', error);

    return Response.json(
      { success: false, message: 'Registration failed. Please try again.' },
      { status: 500 }
    );
  }
}