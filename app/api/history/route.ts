import { NextRequest } from 'next/server';
import { randomUUID } from 'node:crypto';
import { getSessionUser } from '@/lib/auth';
import { getRecordsSql } from '@/lib/records';

type RecordRow = {
  id: string;
  kind: 'regression' | 'hypothesis';
  title: string;
  summary: string;
  details: Record<string, unknown>;
  is_saved: boolean;
  created_at: Date | string;
};

const serialize = (row: RecordRow) => ({
  id: row.id,
  kind: row.kind,
  title: row.title,
  summary: row.summary,
  details: row.details,
  isSaved: row.is_saved,
  createdAt: new Date(row.created_at).toISOString(),
});

export async function GET(request: NextRequest) {
  const user = await getSessionUser(request);
  if (!user) return Response.json({ message: 'Please sign in.' }, { status: 401 });

  try {
    const sql = await getRecordsSql();
    const savedOnly = request.nextUrl.searchParams.get('saved') === 'true';
    const rows = (savedOnly
      ? await sql`SELECT id, kind, title, summary, details, is_saved, created_at FROM analysis_records WHERE user_id = ${user.idText} AND is_saved = TRUE ORDER BY created_at DESC`
      : await sql`SELECT id, kind, title, summary, details, is_saved, created_at FROM analysis_records WHERE user_id = ${user.idText} ORDER BY created_at DESC`) as unknown as RecordRow[];
    return Response.json({ records: rows.map(serialize) });
  } catch (error) {
    console.error('History fetch failed:', error);
    return Response.json({ message: 'Unable to load analysis history.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const user = await getSessionUser(request);
  if (!user) return Response.json({ message: 'Please sign in.' }, { status: 401 });

  try {
    const body = await request.json();
    const kind = body.kind;
    const title = String(body.title || '').trim().slice(0, 120);
    const summary = String(body.summary || '').trim().slice(0, 2000);
    const details = body.details && typeof body.details === 'object' && !Array.isArray(body.details) ? body.details : {};
    if ((kind !== 'regression' && kind !== 'hypothesis') || !title || !summary) {
      return Response.json({ message: 'A valid analysis result is required.' }, { status: 400 });
    }

    const sql = await getRecordsSql();
    const id = randomUUID();
    const rows = await sql`
      INSERT INTO analysis_records (id, user_id, kind, title, summary, details)
      VALUES (${id}, ${user.idText}, ${kind}, ${title}, ${summary}, ${JSON.stringify(details)}::jsonb)
      RETURNING id, kind, title, summary, details, is_saved, created_at
    `;
    return Response.json({ record: serialize(rows[0] as unknown as RecordRow) }, { status: 201 });
  } catch (error) {
    console.error('History save failed:', error);
    return Response.json({ message: 'Unable to record this analysis.' }, { status: 500 });
  }
}