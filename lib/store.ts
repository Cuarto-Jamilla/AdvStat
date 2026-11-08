export type Kind = 'regression' | 'hypothesis';

export type AnalysisRecord = {
  id: string;
  kind: Kind;
  title: string;
  summary: string;
  details: Record<string, unknown>;
  isSaved: boolean;
  createdAt: string;
};

export type NewAnalysis = Pick<AnalysisRecord, 'kind' | 'title' | 'summary' | 'details'>;

async function readResponse<T>(response: Response): Promise<T> {
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'The request could not be completed.');
  return data as T;
}

export async function getRecords(savedOnly = false): Promise<AnalysisRecord[]> {
  const response = await fetch(`/api/history${savedOnly ? '?saved=true' : ''}`, { credentials: 'include', cache: 'no-store' });
  const data = await readResponse<{ records: AnalysisRecord[] }>(response);
  return data.records;
}

export async function recordAnalysis(analysis: NewAnalysis): Promise<AnalysisRecord> {
  const response = await fetch('/api/history', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(analysis),
  });
  const data = await readResponse<{ record: AnalysisRecord }>(response);
  return data.record;
}

export async function setRecordSaved(id: string, isSaved: boolean): Promise<void> {
  const response = await fetch(`/api/history/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ isSaved }),
  });
  await readResponse<{ success: boolean }>(response);
}
