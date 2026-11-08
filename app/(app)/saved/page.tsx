'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { IconBookmark, IconHypo, IconRegression } from '@/components/Icons';
import { getRecords, setRecordSaved, type AnalysisRecord } from '@/lib/store';

const formatDate = (date: string) => new Date(date).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });

export default function SavedPage() {
  const [records, setRecords] = useState<AnalysisRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [removingId, setRemovingId] = useState('');

  useEffect(() => {
    getRecords(true).then(setRecords).catch((reason) => setError(reason.message)).finally(() => setLoading(false));
  }, []);

  const remove = async (record: AnalysisRecord) => {
    setRemovingId(record.id);
    try {
      await setRecordSaved(record.id, false);
      setRecords((items) => items.filter((item) => item.id !== record.id));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to remove saved result.');
    } finally {
      setRemovingId('');
    }
  };

  return (
    <div className="page">
      <header className="section-heading page-heading"><div><p className="eyebrow">YOUR LIBRARY</p><h1 className="title"><span className="bigicon b sm"><IconBookmark /></span>Saved Results</h1><p className="muted">A separate collection of the computations you chose to keep.</p></div><span className="count-label">{records.length} saved</span></header>
      {error && <div className="error" role="alert">{error}</div>}
      {loading ? <div className="card empty-state">Loading saved results…</div> : records.length ? <div className="record-list">
        {records.map((record) => <article className="record-card" key={record.id}>
          <div className="record-heading"><span className={`saved-icon ${record.kind}`}>{record.kind === 'regression' ? <IconRegression size={18} /> : <IconHypo size={18} />}</span><div><h2>{record.title}</h2><time dateTime={record.createdAt}>{formatDate(record.createdAt)}</time></div><button className="ghost solid record-save" onClick={() => remove(record)} disabled={removingId === record.id}><IconBookmark size={18} /><span>Remove</span></button></div>
          <p className="record-summary">{record.summary}</p>
          <details className="record-details"><summary>View inputs and computed values</summary><pre>{JSON.stringify(record.details, null, 2)}</pre></details>
        </article>)}
      </div> : <section className="content-panel empty-panel"><IconBookmark size={24} /><div><h2>No saved results</h2><p>Save a result from either lab, or use History to review every computation.</p><Link className="text-link" href="/history">Open analysis history →</Link></div></section>}
    </div>
  );
}