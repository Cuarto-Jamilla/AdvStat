'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Bell, Scatter } from '@/components/Charts';
import { IconBook, IconHistory, IconHypo, IconRegression } from '@/components/Icons';
import { useApp } from '@/components/Providers';
import { parsePoints, regress } from '@/lib/stats';
import { getRecords, type AnalysisRecord } from '@/lib/store';

const SAMPLE = '1, 52\n2, 55\n3, 61\n4, 64\n5, 70\n6, 74\n7, 79\n8, 85';
const { pts } = parsePoints(SAMPLE);
const regressionPreview = regress(pts)!;
export default function Dashboard() {
  const { user } = useApp();
  const [records, setRecords] = useState<AnalysisRecord[]>([]);

  useEffect(() => {
    getRecords().then(setRecords).catch((error) => console.error('Analysis summary failed:', error));
  }, []);

  const totalRuns = records.length;
  const regressionRuns = records.filter((record) => record.kind === 'regression').length;
  const hypothesisRuns = records.filter((record) => record.kind === 'hypothesis').length;
  const firstName = user?.name.split(' ')[0] || 'there';

  return (
    <div className="page dashboard-page">
      <header className="welcome-row">
        <div>
          <p className="eyebrow">STATISTICAL WORKSPACE</p>
          <h1 className="greet">Welcome back, {firstName}</h1>
          <p className="welcome-copy">A clear place to work through your data and statistical decisions.</p>
        </div>
        <div className="welcome-mark" aria-hidden="true"><span>μ</span><i /><b /></div>
      </header>

      <section className="summary-grid dashboard-summary" aria-label="Workspace summary">
        <div className="summary-card"><span className="summary-icon"><IconBook size={19} /></span><div><b>02</b><span>Statistical modules</span></div></div>
        <div className="summary-card"><span className="summary-icon violet"><IconHistory size={19} /></span><div><b>{totalRuns}</b><span>Analysis completed</span></div></div>
      </section>

      <section className="section-block" aria-labelledby="modules-heading">
        <div className="section-heading"><div><p className="eyebrow">YOUR TOOLKIT</p><h2 id="modules-heading">Choose an analysis</h2></div><span className="section-note">Two focused statistical methods</span></div>
        <div className="module-grid">
          <article className="module-card regression-card">
            <div className="module-top"><span className="module-icon violet"><IconRegression size={20} /></span><span className="module-count">{regressionRuns} runs</span></div>
            <h3>Linear Regression</h3>
            <p className="module-description">Model the relationship between two variables, inspect correlation, and estimate outcomes.</p>
            <div className="preview-chart regression-preview"><Scatter pts={pts} a={regressionPreview.a} b={regressionPreview.b} /></div>
            <div className="module-foot"><span>Y = a + bX <i>·</i> Pearson correlation</span><Link href="/regression" className="text-link">Open analysis <span aria-hidden="true">↗</span></Link></div>
          </article>
          <article className="module-card hypothesis-card">
            <div className="module-top"><span className="module-icon blue"><IconHypo size={20} /></span><span className="module-count">{hypothesisRuns} tests</span></div>
            <h3>Hypothesis Testing</h3>
            <p className="module-description">Run a one-sample Z-test and evaluate evidence against a hypothesized population mean.</p>
            <div className="preview-chart bell-preview"><Bell z={2.55} zc={1.96} tail="two" /></div>
            <div className="module-foot"><span>One-sample Z-test <i>·</i> Known σ</span><Link href="/hypothesis" className="text-link">Open analysis <span aria-hidden="true">↗</span></Link></div>
          </article>
        </div>
      </section>

      <section className="content-panel guide-panel" aria-labelledby="quick-guide-heading">
          <div className="section-heading compact"><div><p className="eyebrow">GET STARTED</p><h2 id="quick-guide-heading">Quick guide</h2></div><IconBook size={20} /></div>
          <ol className="quick-steps">
            <li><span>1</span><div><b>Choose a method</b><p>Select regression or hypothesis testing.</p></div></li>
            <li><span>2</span><div><b>Enter your data</b><p>Use your own values or load the sample.</p></div></li>
            <li><span>3</span><div><b>Review the evidence</b><p>Interpret the results and save what matters.</p></div></li>
          </ol>
          <div className="row"><Link href="/review" className="guide-link">Review topics <span aria-hidden="true">→</span></Link><Link href="/guide" className="guide-link">Read the app guide <span aria-hidden="true">→</span></Link></div>
      </section>
    </div>
  );
}