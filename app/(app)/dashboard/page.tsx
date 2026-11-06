'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useApp } from '@/components/Providers';
import { getRuns } from '@/lib/store';
import { IconRegression, IconHypo, IconSpark } from '@/components/Icons';

const TIPS = [
  'Correlation is not causation — r only measures straight-line association.',
  'A smaller α makes it harder to reject H₀, so you make fewer false alarms (Type I errors).',
  'r² tells you the share of Y’s variation explained by X.',
  'The Z-test needs a known population σ (or a large sample).',
];

export default function Dashboard() {
  const { user } = useApp();
  const [runs, setRuns] = useState({ regression: 0, hypothesis: 0 });
  const [hour, setHour] = useState(12);
  useEffect(() => { setRuns(getRuns()); setHour(new Date().getHours()); }, []);
  const first = user?.name.split(' ')[0];
  return (
    <div className="page">
      <h1 className="greet">Hello, {first}! <span className="wave"></span></h1>
      <div className="grid2">
        <Link href="/regression" className="card tool">
          <div className="bigicon a"><IconRegression size={34} /></div>
          <h2>Regression Lab</h2>
          <p>Enter X and Y data, get Y = a + bX, the correlation r, its strength, and a scatter diagram.</p>
          <span className="pill">{runs.regression} analyses run</span>
        </Link>
        <Link href="/hypothesis" className="card tool">
          <div className="bigicon b"><IconHypo size={34} /></div>
          <h2>Hypothesis Arena</h2>
          <p>State H₀ and H₁, pick α, compute Z, see critical values and a shaded normal curve with the decision.</p>
          <span className="pill">{runs.hypothesis} tests run</span>
        </Link>
      </div>
      <div className="card tip"><IconSpark size={26} /><div><b>Stat tip</b><p>{TIPS[new Date().getDate() % TIPS.length]}</p></div></div>
    </div>
  );
}
