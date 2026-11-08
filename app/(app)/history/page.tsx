'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { IconBookmark, IconHistory, IconHypo, IconRegression } from '@/components/Icons';
import { getRecords, setRecordSaved, type AnalysisRecord } from '@/lib/store';

const formatDate = (date: string) => new Date(date).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });

export default function HistoryPage() {
  const [records, setRecords] = useState<AnalysisRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savingId, setSavingId] = useState('');

  useEffect(() => {
    getRecords().then(setRecords).catch((reason) => setError(reason.message)).finally(() => setLoading(false));
  }, []);

  const toggleSaved = async (record: AnalysisRecord) => {
    setSavingId(record.id);
    try {
      await setRecordSaved(record.id, !record.isSaved);
      setRecords((items) => items.map((item) => item.id === record.id ? { ...item, isSaved: !item.isSaved } : item));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to update saved results.');
    } finally {
      setSavingId('');
    }
  };

  return (
    <div className="page">
      <header className="section-heading page-heading"><div><p className="eyebrow">YOUR WORKSPACE</p><h1 className="title"><span className="bigicon a sm"><IconHistory /></span>Analysis History</h1><p className="muted">Every completed computation for your account, newest first.</p></div><span className="count-label">{records.length} {records.length === 1 ? 'computation' : 'computations'}</span></header>
      {error && <div className="error" role="alert">{error}</div>}
      {loading ? <div className="card empty-state">Loading your history…</div> : records.length ? <div className="record-list">
        {records.map((record) => <article className="record-card" key={record.id}>
          <div className="record-heading"><span className={`saved-icon ${record.kind}`}>{record.kind === 'regression' ? <IconRegression size={18} /> : <IconHypo size={18} />}</span><div><h2>{record.title}</h2><time dateTime={record.createdAt}>{formatDate(record.createdAt)}</time></div><button className={`ghost solid record-save ${record.isSaved ? 'is-saved' : ''}`} onClick={() => toggleSaved(record)} disabled={savingId === record.id} aria-label={record.isSaved ? 'Remove from saved results' : 'Save result'} title={record.isSaved ? 'Remove from saved results' : 'Save result'}><IconBookmark size={18} /><span>{record.isSaved ? 'Saved' : 'Save'}</span></button></div>
          <p className="record-summary">{record.summary}</p>
          <details className="record-details"><summary>View inputs and computed values</summary><pre>{JSON.stringify(record.details, null, 2)}</pre></details>
        </article>)}
      </div> : <section className="content-panel empty-panel"><IconHistory size={24} /><div><h2>No computations yet</h2><p>Your successful regression and hypothesis test runs will appear here.</p><div className="row"><Link className="text-link" href="/regression">Open Regression Lab →</Link><Link className="text-link" href="/hypothesis">Open Hypothesis Testing →</Link></div></div></section>}
    </div>
  );
}