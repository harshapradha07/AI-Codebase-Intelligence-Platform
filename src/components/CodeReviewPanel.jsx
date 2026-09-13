import { useEffect, useState } from 'react';

function CodeReviewPanel({ reviews: initialReviews = [] }) {
  const [reviews, setReviews] = useState(initialReviews);

  useEffect(() => {
    setReviews(initialReviews);
  }, [initialReviews]);

  return (
    <div className="dash-card">
      <div className="dash-card-title">Code Review Panel</div>
      <div className="review-list">
        {reviews.map((review) => (
          <div key={review.file} className="review-item">
            <div className="review-file">{review.file}</div>
            <div className="rec-title">{review.title}</div>
            <div className="rec-desc">{review.description}</div>
            <div className="review-diff">
              <div className="diff-box del">
                {review.diff.map((line) => (
                  <div key={line}>{line}</div>
                ))}
              </div>
              <div className="diff-box add">
                <div>+ Extract helper methods</div>
                <div>+ Add regression tests</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CodeReviewPanel;
