
import { getSql } from '@/lib/db';

export async function GET() {
  try {
    const sql = getSql();
    const result = await sql`SELECT NOW() AS current_time`;

    return Response.json({
      success: true,
      message: 'Connected to Neon PostgreSQL!',
      time: result[0].current_time,
    });
  } catch (error) {
    console.error('Database connection failed:', error);

    return Response.json(
      { success: false, message: 'Database connection failed.' },
      { status: 500 }
    );
  }
}
