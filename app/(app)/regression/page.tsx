'use client';
import { useMemo, useState } from 'react';
import { Scatter } from '@/components/Charts';
import { parsePoints, regress, strength } from '@/lib/stats';
import { bumpRun } from '@/lib/store';
import { IconRegression } from '@/components/Icons';

const SAMPLE = '1, 52\n2, 55\n3, 61\n4, 64\n5, 70\n6, 74\n7, 79\n8, 85';
const f = (v: number, d = 4) => v.toFixed(d);

export default function Regression() {
  const [text, setText] = useState(SAMPLE);
  const [sub, setSub] = useState(SAMPLE);
  const [px, setPx] = useState('9');
  const { pts, err } = useMemo(() => parsePoints(sub), [sub]);
  const res = useMemo(() => (err ? null : regress(pts)), [pts, err]);
  const s = res ? strength(res.r) : null;
  const run = () => { setSub(text); bumpRun('regression'); };
  const pred = res && px.trim() !== '' && isFinite(+px) ? res.a + res.b * +px : null;

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
          {!err && !res && <div className="error">Need at least 3 pairs, and X values must not all be equal.</div>}
        </div>
        {res && s && (
          <div className="card">
            <h3>2 · Results</h3>
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
          </div>
        )}
      </div>
      {res && (
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
