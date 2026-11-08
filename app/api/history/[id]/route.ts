import { NextRequest } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { getRecordsSql } from '@/lib/records';

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const user = await getSessionUser(request);
  if (!user) return Response.json({ message: 'Please sign in.' }, { status: 401 });

  try {
    const body = await request.json();
    if (typeof body.isSaved !== 'boolean') return Response.json({ message: 'Saved state is required.' }, { status: 400 });
    const sql = await getRecordsSql();
    const rows = await sql`UPDATE analysis_records SET is_saved = ${body.isSaved} WHERE id = ${params.id} AND user_id = ${user.idText} RETURNING id`;
    if (!rows.length) return Response.json({ message: 'Analysis not found.' }, { status: 404 });
    return Response.json({ success: true });
  } catch (error) {
    console.error('Saved result update failed:', error);
    return Response.json({ message: 'Unable to update saved results.' }, { status: 500 });
  }
}