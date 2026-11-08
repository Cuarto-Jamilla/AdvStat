import { IconInfo } from '@/components/Icons';

const STEPS = [
  ['Create an account or sign in', 'Open the app, use “Create account” the first time, then sign in. Use the sun/moon button to switch light and dark mode.'],
  ['Linear Regression: enter data', 'Choose Linear Regression, type one “x, y” pair per line (3+ pairs) or press “Load sample”, then click Analyze.'],
  ['Read the regression results', 'See the equation Y = a + bX, the correlation r, r², and the strength label (very strong ≥ 0.9, strong ≥ 0.7, moderate ≥ 0.4, weak ≥ 0.2). Use the predictor to estimate Y for a new X.'],
  ['Interpret the scatter diagram', 'Dots are your data; the dashed line is the fitted regression line. Dots hugging the line mean a stronger relationship.'],
  ['Hypothesis Testing: set up the test', 'Type H₀ and H₁, choose the test type (two, right or left-tailed) and α (e.g., 0.05).'],
  ['Enter sample data and run', 'Provide μ₀, sample mean x̄, population σ and n, then click Run Z-test.'],
  ['Read the decision', 'Compare the computed z with the critical z (see the Z-table). The app reports Reject / Fail to reject H₀ and shades the normal curve: green is acceptance, red is rejection.'],
];

export default function Guide() {
  return (
    <div className="page">
      <h1 className="title"><span className="bigicon a sm"><IconInfo /></span>About ADVSTAT Studio</h1>
      <p className="muted">A focused learning workspace for linear regression and one-sample Z-tests.</p>
      <ol className="steps">
        {STEPS.map(([t, d], i) => <li key={i} className="card"><span className="num">{i + 1}</span><div><b>{t}</b><p>{d}</p></div></li>)}
      </ol>
    </div>
  );
}
