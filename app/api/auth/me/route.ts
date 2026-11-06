import { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('advstat_session')?.value;
    const secret = process.env.AUTH_SECRET;

    if (!token || !secret) {
      return Response.json(
        { success: false, user: null },
        { status: 401 }
      );
    }

    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(secret)
    );

    return Response.json({
      success: true,
      user: {
        id: payload.userId,
        name: payload.name,
        email: payload.email,
      },
    });
  } catch {
    return Response.json(
      { success: false, user: null },
      { status: 401 }
    );
  }
}