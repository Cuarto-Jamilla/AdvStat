import { normPdf, type Pt, type Tail } from '@/lib/stats';

export function Scatter({ pts, a, b }: { pts: Pt[]; a: number; b: number }) {
  const W = 640, H = 380, P = { l: 56, r: 20, t: 20, b: 48 };
  const xs = pts.map((p) => p.x), ys = pts.map((p) => p.y);
  const pad = (lo: number, hi: number) => { const d = hi - lo || 1; return [lo - d * 0.08, hi + d * 0.08]; };
  const [x0, x1] = pad(Math.min(...xs), Math.max(...xs));
  const [y0, y1] = pad(Math.min(...ys), Math.max(...ys));
  const sx = (v: number) => P.l + ((v - x0) / (x1 - x0)) * (W - P.l - P.r);
  const sy = (v: number) => H - P.b - ((v - y0) / (y1 - y0)) * (H - P.t - P.b);
  const ticks = (lo: number, hi: number) => Array.from({ length: 5 }, (_, i) => lo + ((hi - lo) * i) / 4);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="chart" role="img" aria-label="Scatter diagram with regression line">
      <defs><clipPath id="clip"><rect x={P.l} y={P.t} width={W - P.l - P.r} height={H - P.t - P.b} /></clipPath></defs>
      {ticks(y0, y1).map((t, i) => (<g key={'y' + i}><line x1={P.l} x2={W - P.r} y1={sy(t)} y2={sy(t)} className="grid" /><text x={P.l - 8} y={sy(t) + 4} textAnchor="end" className="tick">{t.toFixed(1)}</text></g>))}
      {ticks(x0, x1).map((t, i) => (<text key={'x' + i} x={sx(t)} y={H - P.b + 20} textAnchor="middle" className="tick">{t.toFixed(1)}</text>))}
      <line x1={P.l} x2={P.l} y1={P.t} y2={H - P.b} className="axis" /><line x1={P.l} x2={W - P.r} y1={H - P.b} y2={H - P.b} className="axis" />
      <text x={W / 2} y={H - 8} textAnchor="middle" className="tick">X</text>
      <text x={14} y={H / 2} textAnchor="middle" transform={`rotate(-90 14 ${H / 2})`} className="tick">Y</text>
      <g clipPath="url(#clip)"><line x1={sx(x0)} y1={sy(a + b * x0)} x2={sx(x1)} y2={sy(a + b * x1)} className="regline" /></g>
      {pts.map((p, i) => (<circle key={i} cx={sx(p.x)} cy={sy(p.y)} r={5.5} className="pt"><title>{`(${p.x}, ${p.y})`}</title></circle>))}
    </svg>
  );
}

export function Bell({ z, zc, tail }: { z: number; zc: number; tail: Tail }) {
  const W = 640, H = 330, m = Math.max(4, Math.ceil(Math.abs(z) + 0.5));
  const sx = (v: number) => 20 + ((v + m) / (2 * m)) * (W - 40);
  const sy = (v: number) => H - 44 - (v / 0.42) * (H - 80);
  const area = (lo: number, hi: number) => {
    let d = `M${sx(lo)},${sy(0)}`;
    for (let i = 0; i <= 80; i++) { const v = lo + ((hi - lo) * i) / 80; d += ` L${sx(v)},${sy(normPdf(v))}`; }
    return d + ` L${sx(hi)},${sy(0)}Z`;
  };
  const rej: [number, number][] = tail === 'two' ? [[-m, -zc], [zc, m]] : tail === 'right' ? [[zc, m]] : [[-m, -zc]];
  const crits = tail === 'two' ? [-zc, zc] : tail === 'right' ? [zc] : [-zc];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="chart" role="img" aria-label="Normal curve with rejection regions">
      <path d={area(-m, m)} className="acc" />
      {rej.map((r, i) => <path key={i} d={area(r[0], r[1])} className="rej" />)}
      <line x1={20} x2={W - 20} y1={sy(0)} y2={sy(0)} className="axis" />
      {Array.from({ length: 2 * m + 1 }, (_, i) => i - m).map((t) => (<text key={t} x={sx(t)} y={sy(0) + 18} textAnchor="middle" className="tick">{t}</text>))}
      {crits.map((c) => (<g key={c}><line x1={sx(c)} x2={sx(c)} y1={sy(0)} y2={sy(0.4)} className="critline" /><text x={sx(c)} y={sy(0.4) - 6} textAnchor="middle" className="tick">{`z = ${c.toFixed(3)}`}</text></g>))}
      <line x1={sx(z)} x2={sx(z)} y1={sy(0)} y2={sy(normPdf(z)) - 4} className="zline" />
      <circle cx={sx(z)} cy={sy(normPdf(z))} r={6} className="zdot" />
      <text x={sx(z)} y={sy(0) + 36} textAnchor="middle" className="zlabel">{`computed z = ${z.toFixed(3)}`}</text>
      <text x={W / 2} y={sy(0.12)} textAnchor="middle" className="reglabel">Fail to reject H₀</text>
    </svg>
  );
}
