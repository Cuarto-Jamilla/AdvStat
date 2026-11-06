'use client';
import { useState } from 'react';
import { Bell } from '@/components/Charts';
import { critMag, zTest, type Tail } from '@/lib/stats';
import { bumpRun } from '@/lib/store';
import { IconHypo } from '@/components/Icons';

const ALPHAS = [0.1, 0.05, 0.025, 0.01, 0.005, 0.001];
type Out = ReturnType<typeof zTest> & { tail: Tail; alpha: number };

export default function Hypothesis() {
  const [h0, setH0] = useState('μ = 100');
  const [h1, setH1] = useState('μ ≠ 100');
  const [alpha, setAlpha] = useState(0.05);
  const [tail, setTail] = useState<Tail>('two');
  const [mu0, setMu0] = useState('100'); const [xbar, setXbar] = useState('104.5');
  const [sigma, setSigma] = useState('12'); const [n, setN] = useState('40');
  const [err, setErr] = useState(''); const [out, setOut] = useState<Out | null>(null);

  const run = () => {
    const v = [mu0, xbar, sigma, n].map(Number);
    if ([mu0, xbar, sigma, n].some((s) => s.trim() === '') || v.some((x) => !isFinite(x))) return setErr('Fill in all numeric fields.');
    if (v[2] <= 0 || v[3] < 1) return setErr('σ must be positive and n at least 1.');
    setErr(''); setOut({ ...zTest(v[1], v[0], v[2], v[3], alpha, tail), tail, alpha });
    bumpRun('hypothesis');
  };
  const pick = (t: Tail) => { setTail(t); };
  const sym = tail === 'two' ? '≠' : tail === 'right' ? '>' : '<';

  return (
    <div className="page">
      <h1 className="title"><span className="bigicon b sm"><IconHypo /></span>Hypothesis Arena</h1>
      <p className="muted">One-sample Z-test for a mean (population σ known).</p>
      <div className="grid2 top">
        <div className="card">
          <h3>1 · State hypotheses</h3>
          <label>H₀ (null)<input value={h0} onChange={(e) => setH0(e.target.value)} /></label>
          <label>H₁ (alternative)<input value={h1} onChange={(e) => setH1(e.target.value)} /></label>
          <label>Test type
            <select value={tail} onChange={(e) => pick(e.target.value as Tail)}>
              <option value="two">Two-tailed (H₁: μ ≠ μ₀)</option>
              <option value="right">Right-tailed (H₁: μ &gt; μ₀)</option>
              <option value="left">Left-tailed (H₁: μ &lt; μ₀)</option>
            </select>
          </label>
          <label>Level of significance (α)
            <select value={alpha} onChange={(e) => setAlpha(+e.target.value)}>{ALPHAS.map((a) => <option key={a} value={a}>{a}</option>)}</select>
          </label>
        </div>
        <div className="card">
          <h3>2 · Sample data</h3>
          <div className="fields">
            <label>Hypothesized mean μ₀<input value={mu0} onChange={(e) => setMu0(e.target.value)} /></label>
            <label>Sample mean x̄<input value={xbar} onChange={(e) => setXbar(e.target.value)} /></label>
            <label>Population σ<input value={sigma} onChange={(e) => setSigma(e.target.value)} /></label>
            <label>Sample size n<input value={n} onChange={(e) => setN(e.target.value)} /></label>
          </div>
          {err && <div className="error">{err}</div>}
          <button className="primary" onClick={run}>Run Z-test</button>
          <p className="muted small">Tip: for this test type, H₁ should read <code>μ {sym} μ₀</code>.</p>
        </div>
      </div>
      {out && (
        <>
          <div className="card">
            <h3>3 · Computation</h3>
            <div className="eq">z = (x̄ − μ₀) / (σ/√n) = ({xbar} − {mu0}) / ({sigma}/√{n}) = {out.z.toFixed(4)}</div>
            <div className="stats">
              <div><small>Std. error</small><b>{out.se.toFixed(4)}</b></div>
              <div><small>Computed z</small><b>{out.z.toFixed(4)}</b></div>
              <div><small>Critical z</small><b>{out.tail === 'two' ? '±' : out.tail === 'left' ? '−' : ''}{out.zc.toFixed(3)}</b></div>
              <div><small>p-value</small><b>{out.p < 0.0001 ? '< 0.0001' : out.p.toFixed(4)}</b></div>
            </div>
            <div className={`verdict ${out.reject ? 'rej' : 'acc'}`}>
              <b>{out.reject ? 'Reject H₀' : 'Fail to reject H₀'}</b>
              <span>{out.reject ? `The computed z falls in the rejection region (p ≤ α = ${out.alpha}). There is sufficient evidence for H₁: ${h1}.` : `The computed z falls in the acceptance region (p > α = ${out.alpha}). There is not enough evidence for H₁: ${h1}.`}</span>
            </div>
          </div>
          <div className="card"><h3>4 · Normal curve</h3><Bell z={out.z} zc={out.zc} tail={out.tail} />
            <div className="legend"><span className="k acc" /> Acceptance region <span className="k rej" /> Rejection region(s) <span className="k z" /> Computed z</div>
          </div>
          <div className="card">
            <h3>5 · Z-table values (critical)</h3>
            <div className="scroll"><table>
              <thead><tr><th>α</th><th>One-tailed</th><th>Two-tailed</th></tr></thead>
              <tbody>{ALPHAS.map((a) => <tr key={a} className={a === out.alpha ? 'hl' : ''}><td>{a}</td><td>{critMag(a, 'right').toFixed(3)}</td><td>±{critMag(a, 'two').toFixed(3)}</td></tr>)}</tbody>
            </table></div>
          </div>
        </>
      )}
    </div>
  );
}
