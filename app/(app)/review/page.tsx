import { IconBook, IconHypo, IconRegression } from '@/components/Icons';

export default function ReviewTopics() {
  return (
    <div className="page">
      <header className="page-heading"><p className="eyebrow">STUDY NOTES</p><h1 className="title"><span className="bigicon a sm"><IconBook /></span>Review Topics</h1><p className="muted">Review each method on its own before interpreting a result.</p></header>
      <section className="review-topic" aria-labelledby="regression-review-heading">
        <header className="review-topic-heading"><span className="module-icon violet"><IconRegression size={20} /></span><div><p className="eyebrow">TOPIC 01</p><h2 id="regression-review-heading">Linear Regression</h2></div></header>
        <div className="review-topic-grid">
          <article><h3>Purpose</h3><p>Describe and estimate the linear relationship between an explanatory variable X and an outcome Y.</p></article>
          <article><h3>Model</h3><div className="eq">Ŷ = a + bX</div><p><b>a</b> is the intercept; <b>b</b> is the expected change in Y for a one-unit increase in X.</p></article>
          <article><h3>Association</h3><p>Pearson’s <b>r</b> describes direction and strength of linear association. <b>r²</b> is the proportion of variation in Y accounted for by the fitted linear model.</p></article>
          <article><h3>Interpretation</h3><p>Inspect the scatter diagram for direction, strength, and unusual points. Correlation and regression describe association; they do not establish causation.</p></article>
        </div>
      </section>
      <section className="review-topic" aria-labelledby="hypothesis-review-heading">
        <header className="review-topic-heading"><span className="module-icon blue"><IconHypo size={20} /></span><div><p className="eyebrow">TOPIC 02</p><h2 id="hypothesis-review-heading">One-Sample Z-Test</h2></div></header>
        <div className="review-topic-grid">
          <article><h3>Purpose</h3><p>Evaluate a sample mean against a hypothesized population mean when the population standard deviation σ is known.</p></article>
          <article><h3>Test statistic</h3><div className="eq">z = (x̄ − μ₀) / (σ / √n)</div><p>The statistic expresses the distance between x̄ and μ₀ in standard-error units.</p></article>
          <article><h3>Decision rule</h3><p>Compare the p-value with α, or compare the computed z with the critical value for the selected tail. Reject H₀ when p ≤ α.</p></article>
          <article><h3>Interpretation</h3><p>Rejecting H₀ means the sample provides sufficient evidence for H₁ at the chosen α. Failing to reject H₀ does not prove H₀ true.</p></article>
        </div>
      </section>
    </div>
  );
}