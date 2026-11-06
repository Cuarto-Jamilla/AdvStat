export type Kind = 'regression' | 'hypothesis';
export const getRuns = (): Record<Kind, number> => {
  try { return { regression: 0, hypothesis: 0, ...JSON.parse(localStorage.getItem('advstat_runs') || '{}') }; }
  catch { return { regression: 0, hypothesis: 0 }; }
};
export const bumpRun = (k: Kind) => {
  const r = getRuns(); r[k]++;
  try { localStorage.setItem('advstat_runs', JSON.stringify(r)); } catch {}
};
