import CodeReviewPanel from '../components/CodeReviewPanel';

function CodeReview({ reviews = [] }) {
  return (
    <div className="page-section active">
      <div className="hero">
        <h1>Code <span className="gradient-text-2">Review</span></h1>
        <p>Review recommendations from the original experience are preserved.</p>
      </div>
      <CodeReviewPanel reviews={reviews} />
    </div>
  );
}

export default CodeReview;
