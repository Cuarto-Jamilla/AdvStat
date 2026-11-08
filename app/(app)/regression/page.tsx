'use client';
import { useMemo, useState } from 'react';
import { Scatter } from '@/components/Charts';
import { parsePoints, regress, strength } from '@/lib/stats';
import { recordAnalysis, setRecordSaved } from '@/lib/store';
import { IconBookmark, IconCheck, IconRegression } from '@/components/Icons';

const SAMPLE = '1, 52\n2, 55\n3, 61\n4, 64\n5, 70\n6, 74\n7, 79\n8, 85';
const f = (v: number, d = 4) => v.toFixed(d);

export default function Regression() {
  const [text, setText] = useState(SAMPLE);
  const [sub, setSub] = useState(SAMPLE);
  const [px, setPx] = useState('9');
  const [saved, setSaved] = useState(false);
  const [hasRun, setHasRun] = useState(false);
  const [recordId, setRecordId] = useState('');
  const [recording, setRecording] = useState(false);
  const [saving, setSaving] = useState(false);
  const [recordError, setRecordError] = useState('');
  const { pts, err } = useMemo(() => parsePoints(sub), [sub]);
  const res = useMemo(() => (err ? null : regress(pts)), [pts, err]);
  const s = res ? strength(res.r) : null;
  const run = async () => {
    setSub(text); setHasRun(true); setSaved(false); setRecordId(''); setRecordError('');
    const parsed = parsePoints(text);
    if (parsed.err || parsed.pts.length < 3) return;
    const result = regress(parsed.pts);
    if (!result) return;
    const equation = `Y = ${f(result.a)} ${result.b >= 0 ? '+' : '−'} ${f(Math.abs(result.b))}X`;
    setRecording(true);
    try {
      const record = await recordAnalysis({
        kind: 'regression',
        title: 'Linear regression',
        summary: `${equation}; r = ${f(result.r)}, r² = ${f(result.r2)}, n = ${result.n}`,
        details: { input: text, points: parsed.pts, intercept: result.a, slope: result.b, correlation: result.r, rSquared: result.r2, sampleSize: result.n, predictionX: Number(px) },
      });
      setRecordId(record.id);
    } catch (reason) {
      setRecordError(reason instanceof Error ? reason.message : 'This result could not be added to History.');
    } finally {
      setRecording(false);
    }
  };
  const pred = res && px.trim() !== '' && isFinite(+px) ? res.a + res.b * +px : null;
  const save = async () => {
    if (!recordId) return;
    setSaving(true); setRecordError('');
    try {
      await setRecordSaved(recordId, true);
      setSaved(true);
    } catch (reason) {
      setRecordError(reason instanceof Error ? reason.message : 'This result could not be saved.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page">
      <h1 className="title"><span className="bigicon a sm"><IconRegression /></span>Regression Lab</h1>
      <p className="muted">Simple linear regression: Y = a + bX, with Pearson’s r.</p>
      <div className="grid2 top">
        <div className="card">
          <h3>1 · Enter data</h3>
          <p className="muted small">One pair per line: <code>x, y</code> (at least 3 pairs).</p>
          <textarea rows={10} value={text} onChange={(e) => setText(e.target.value)} spellCheck={false} />
          <div className="row">
            <button className="primary" onClick={run}>Analyze</button>
            <button className="ghost solid" onClick={() => setText(SAMPLE)}>Load sample</button>
            <button className="ghost solid" onClick={() => setText('')}>Clear</button>
          </div>
          {err && <div className="error">{err}</div>}
          {hasRun && !err && !res && <div className="error">Need at least 3 pairs, and X values must not all be equal.</div>}
        </div>
        {hasRun && res && s && (
          <div className="card">
            <h3>2 · Results</h3>
            <div className="result-status" role="status" aria-live="polite"><IconCheck size={18} /><span>Analysis complete</span><small>{recording ? 'Recording in History…' : 'Your results are ready below.'}</small></div>
            <div className="eq">Y = {f(res.a)} {res.b >= 0 ? '+' : '−'} {f(Math.abs(res.b))}X</div>
            <div className="stats">
              <div><small>a (intercept)</small><b>{f(res.a)}</b></div>
              <div><small>b (slope)</small><b>{f(res.b)}</b></div>
              <div><small>r</small><b>{f(res.r)}</b></div>
              <div><small>r²</small><b>{f(res.r2)}</b></div>
              <div><small>n</small><b>{res.n}</b></div>
            </div>
            <div className={`badge ${Math.abs(res.r) >= 0.7 ? 'good' : Math.abs(res.r) >= 0.4 ? 'mid' : 'low'}`}>{s.text}</div>
            <label className="inline">Predict Y for X =<input value={px} onChange={(e) => setPx(e.target.value)} style={{ width: 90 }} /></label>
            {pred !== null && <div className="muted">Ŷ = <b>{f(pred, 3)}</b></div>}
            {recordError && <div className="error" role="alert">{recordError}</div>}
            <div className="row"><button className="ghost solid save-button" onClick={save} disabled={saved || !recordId || saving}><IconBookmark size={18} />{saved ? 'Saved to results' : saving ? 'Saving…' : recording ? 'Recording…' : 'Save result'}</button></div>
          </div>
        )}
      </div>
      {hasRun && res && (
        <>
          <div className="card"><h3>3 · Scatter diagram</h3><Scatter pts={pts} a={res.a} b={res.b} /></div>
          <div className="card">
            <h3>4 · Solution table</h3>
            <div className="scroll"><table>
              <thead><tr><th>X</th><th>Y</th><th>XY</th><th>X²</th><th>Y²</th></tr></thead>
              <tbody>
                {pts.map((p, i) => <tr key={i}><td>{p.x}</td><td>{p.y}</td><td>{f(p.x * p.y, 2)}</td><td>{f(p.x * p.x, 2)}</td><td>{f(p.y * p.y, 2)}</td></tr>)}
                <tr className="sum"><td>{f(res.Sx, 2)}</td><td>{f(res.Sy, 2)}</td><td>{f(res.Sxy, 2)}</td><td>{f(res.Sx2, 2)}</td><td>{f(res.Sy2, 2)}</td></tr>
              </tbody>
            </table></div>
            <p className="muted small">b = (nΣXY − ΣXΣY) / (nΣX² − (ΣX)²) · a = (ΣY − bΣX) / n · r = (nΣXY − ΣXΣY) / √[(nΣX² − (ΣX)²)(nΣY² − (ΣY)²)]</p>
          </div>
        </>
      )}
    </div>
  );
}
