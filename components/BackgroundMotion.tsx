const PARTICLES: [number, number, number][] = [
  [88, 18, 1], [16, 29, 2], [73, 42, 3], [39, 61, 4], [91, 73, 5],
  [24, 82, 6], [60, 14, 7], [47, 35, 8], [11, 55, 9], [81, 91, 10],
  [32, 12, 11], [67, 78, 12], [53, 89, 13], [7, 91, 14], [96, 46, 15],
];

export default function BackgroundMotion() {
  return (
    <div className="ambient-background" aria-hidden="true">
      <div className="ambient-wash" />
      <svg className="ambient-svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="ambient-blue" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#55baff" stopOpacity="0.08" />
            <stop offset="0.5" stopColor="#55baff" stopOpacity="0.62" />
            <stop offset="1" stopColor="#55baff" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="ambient-violet" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#ae93ff" stopOpacity="0.06" />
            <stop offset="0.55" stopColor="#ae93ff" stopOpacity="0.54" />
            <stop offset="1" stopColor="#ae93ff" stopOpacity="0.08" />
          </linearGradient>
          <filter id="ambient-glow" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <path id="ambient-wave-a" className="ambient-wave wave-blue" d="M-100 700 C110 630 190 470 390 540 S700 780 895 620 1200 400 1390 510 1570 600 1710 470" />
        <path id="ambient-wave-b" className="ambient-wave wave-violet" d="M-100 340 C130 470 220 610 420 520 S740 270 950 390 1210 660 1410 500 1590 350 1710 420" />
        <path id="ambient-wave-c" className="ambient-wave wave-blue wave-secondary" d="M-100 870 C180 760 280 840 480 740 S770 600 970 700 1260 870 1450 720 1610 650 1710 690" />
        {PARTICLES.map(([x, y, delay]) => (
          <circle key={delay} className={`ambient-particle particle-${delay}`} cx={`${x}%`} cy={`${y}%`} r={delay % 4 === 0 ? 2.2 : 1.5} />
        ))}
        <circle className="ambient-traveler traveler-blue" r="3.4" filter="url(#ambient-glow)">
          <animateMotion dur="34s" repeatCount="indefinite" path="M-100 700 C110 630 190 470 390 540 S700 780 895 620 1200 400 1390 510 1570 600 1710 470" />
        </circle>
        <circle className="ambient-traveler traveler-violet" r="3" filter="url(#ambient-glow)">
          <animateMotion dur="42s" begin="-17s" repeatCount="indefinite" path="M-100 340 C130 470 220 610 420 520 S740 270 950 390 1210 660 1410 500 1590 350 1710 420" />
        </circle>
      </svg>
    </div>
  );
}