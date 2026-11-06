export type Pt = { x: number; y: number };
export type Tail = 'two' | 'left' | 'right';

export function parsePoints(t: string): { pts: Pt[]; err?: string } {
  const pts: Pt[] = [];
  const lines = t.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const s = lines[i].trim();
    if (!s) continue;
    const p = s.split(/[\s,;]+/).filter(Boolean).map(Number);
    if (p.length !== 2 || p.some((v) => !isFinite(v))) return { pts, err: `Line ${i + 1}: enter two numbers like "3, 61"` };
    pts.push({ x: p[0], y: p[1] });
  }
  return { pts };
}

export function regress(pts: Pt[]) {
  const n = pts.length;
  const Sx = pts.reduce((s, p) => s + p.x, 0), Sy = pts.reduce((s, p) => s + p.y, 0);
  const Sxy = pts.reduce((s, p) => s + p.x * p.y, 0);
  const Sx2 = pts.reduce((s, p) => s + p.x * p.x, 0), Sy2 = pts.reduce((s, p) => s + p.y * p.y, 0);
  const dx = n * Sx2 - Sx * Sx, dy = n * Sy2 - Sy * Sy, dxy = n * Sxy - Sx * Sy;
  if (n < 3 || dx === 0) return null;
  const b = dxy / dx, a = (Sy - b * Sx) / n;
  const r = dy === 0 ? 0 : dxy / Math.sqrt(dx * dy);
  return { n, Sx, Sy, Sxy, Sx2, Sy2, a, b, r, r2: r * r };
}

export function strength(r: number) {
  const m = Math.abs(r);
  const label = m >= 0.9 ? 'Very strong' : m >= 0.7 ? 'Strong' : m >= 0.4 ? 'Moderate' : m >= 0.2 ? 'Weak' : 'Very weak / none';
  const dir = m < 0.05 ? '' : r > 0 ? ' positive' : ' negative';
  return { label, dir, text: `${label}${dir} relationship` };
}

function erf(x: number) {
  const s = Math.sign(x); x = Math.abs(x);
  const t = 1 / (1 + 0.3275911 * x);
  const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x);
  return s * y;
}
export const normCdf = (z: number) => 0.5 * (1 + erf(z / Math.SQRT2));
export const normPdf = (z: number) => Math.exp(-z * z / 2) / Math.sqrt(2 * Math.PI);
export function normInv(p: number) {
  let lo = -10, hi = 10;
  for (let i = 0; i < 80; i++) { const m = (lo + hi) / 2; normCdf(m) < p ? (lo = m) : (hi = m); }
  return (lo + hi) / 2;
}
export const critMag = (alpha: number, tail: Tail) => normInv(1 - (tail === 'two' ? alpha / 2 : alpha));

export function zTest(xbar: number, mu0: number, sigma: number, n: number, alpha: number, tail: Tail) {
  const se = sigma / Math.sqrt(n);
  const z = (xbar - mu0) / se;
  const zc = critMag(alpha, tail);
  const p = tail === 'two' ? 2 * (1 - normCdf(Math.abs(z))) : tail === 'right' ? 1 - normCdf(z) : normCdf(z);
  const reject = tail === 'two' ? Math.abs(z) > zc : tail === 'right' ? z > zc : z < -zc;
  return { se, z, zc, p, reject };
}
