import type { ReactNode } from 'react';
type P = { size?: number };
const Svg = ({ size = 22, children }: P & { children: ReactNode }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>{children}</svg>
);

export const Logo = ({ size = 40 }: P) => (
  <svg width={size} height={size} viewBox="0 0 48 48" aria-label="ADVSTAT Studio">
    <defs>
      <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#7c5cff" /><stop offset="1" stopColor="#22d3ee" /></linearGradient>
    </defs>
    <rect width="48" height="48" rx="14" fill="url(#lg)" />
    <path d="M7 36 C16 36 17 12 24 12 S32 36 41 36" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
    <path d="M36 6l1.4 3.1L40.5 10.5l-3.1 1.4L36 15l-1.4-3.1L31.5 10.5l3.1-1.4z" fill="#fff" />
  </svg>
);
export const IconHome = (p: P) => <Svg {...p}><path d="M3 11l9-7 9 7" /><path d="M5 10v10h14V10" /><path d="M9 16l2-2 2 1.5 2-3" /></Svg>;
export const IconRegression = (p: P) => <Svg {...p}><path d="M3 3v18h18" /><circle cx="8" cy="15" r="1.3" /><circle cx="12" cy="12" r="1.3" /><circle cx="16" cy="9" r="1.3" /><circle cx="19" cy="7" r="1.3" /><path d="M5 17L20 5" strokeDasharray="2 2.5" /></Svg>;
export const IconHypo = (p: P) => <Svg {...p}><path d="M2 19C6 19 8 5 12 5s6 14 10 14" /><path d="M2 19h20" /><path d="M17 19c1.2-3 2-6 2.6-9" strokeWidth="2.6" /><path d="M12 5V2" /></Svg>;
export const IconBook = (p: P) => <Svg {...p}><path d="M4 5a2 2 0 012-2h13v16H6a2 2 0 00-2 2z" /><path d="M4 19v-14" /><path d="M9 8h6M9 12h4" /></Svg>;
export const IconSun = (p: P) => <Svg {...p}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></Svg>;
export const IconMoon = (p: P) => <Svg {...p}><path d="M20 14.5A8 8 0 019.5 4 8 8 0 1020 14.5z" /><path d="M17 3v3M15.5 4.5h3" /></Svg>;
export const IconLogout = (p: P) => <Svg {...p}><path d="M10 4H5v16h5" /><path d="M14 8l4 4-4 4M18 12H9" /></Svg>;
export const IconUser = (p: P) => <Svg {...p}><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.6-6 8-6s8 2 8 6" /></Svg>;
export const IconSpark = (p: P) => <Svg {...p}><path d="M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2z" /></Svg>;
