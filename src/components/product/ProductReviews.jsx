import React, { useState } from 'react';
import { Star, CheckCircle2, MessageSquare, Plus } from 'lucide-react';
import Button from '../common/Button';

/**
 * Herbix Product Reviews
 *
 * No real customer reviews exist yet, so this intentionally does not display
 * a fabricated average rating, review count, or invented testimonials.
 * Reviews submitted here are session-local demo content only (not persisted
 * or sent anywhere) — they exist to demonstrate the interaction, not to
 * claim real customer feedback.
 */
export default function ProductReviews({ className = '' }) {
  const [reviews, setReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [authorName, setAuthorName] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(5);

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    setReviews((prev) => [
      { id: Date.now(), name: authorName.trim() || 'Anonymous', rating, body: reviewText.trim(), date: 'Just now' },
      ...prev
    ]);
    setReviewSubmitted(true);
    setTimeout(() => {
      setShowReviewForm(false);
      setReviewSubmitted(false);
      setAuthorName('');
      setReviewText('');
      setRating(5);
    }, 2500);
  };

  return (
    <div className={`flex flex-col gap-10 ${className}`}>
      {/* Header / Write Review CTA */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-4xl bg-white border border-cream-200 shadow-soft">
        <div>
          <h3 className="font-display font-bold text-xl text-botanical-950">
            {reviews.length > 0 ? `${reviews.length} review${reviews.length !== 1 ? 's' : ''}` : 'No reviews yet'}
          </h3>
          <p className="text-xs sm:text-sm text-charcoal-500 mt-1">
            {reviews.length > 0
              ? 'Thank you to everyone who has shared their experience so far.'
              : 'Be the first to share your experience with this herbal bite.'}
          </p>
        </div>
        <Button
          onClick={() => setShowReviewForm(!showReviewForm)}
          variant="outline"
          size="md"
          rounded="full"
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Write a Review
        </Button>
      </div>

      {/* Review Submission Form */}
      {showReviewForm && (
        <div className="p-6 sm:p-8 rounded-4xl bg-white border border-cream-300 shadow-soft-lg">
          {reviewSubmitted ? (
            <div className="text-center py-6">
              <CheckCircle2 className="w-10 h-10 text-leaf-600 mx-auto mb-2" />
              <h4 className="font-display font-bold text-xl text-botanical-950">Thank you for your review!</h4>
              <p className="text-xs text-charcoal-500 mt-1">Your feedback helps others considering Herbix.</p>
            </div>
          ) : (
            <form onSubmit={handleReviewSubmit} className="flex flex-col gap-4 max-w-xl mx-auto">
              <h4 className="font-display font-bold text-xl text-botanical-950">Share Your Experience</h4>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-charcoal-700">Rating:</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setRating(s)}
                      className="p-1 text-lemon-400"
                      aria-label={`Rate ${s} out of 5 stars`}
                    >
                      <Star className={`w-5 h-5 ${s <= rating ? 'fill-lemon-400' : 'text-cream-300'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <input
                type="text"
                required
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Your Name"
                className="w-full bg-cream-50 text-charcoal-900 px-4 py-2.5 rounded-xl border border-cream-300 text-xs focus:outline-none focus:border-leaf-600"
              />

              <textarea
                required
                rows={3}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="How was your experience with Herbix?"
                className="w-full bg-cream-50 text-charcoal-900 p-4 rounded-2xl border border-cream-300 text-xs focus:outline-none focus:border-leaf-600"
              />

              <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" size="sm" onClick={() => setShowReviewForm(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="ginger" size="sm">
                  Submit Review
                </Button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Submitted Reviews (session-local only) */}
      {reviews.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev) => (
            <div key={rev.id} className="p-6 rounded-3xl bg-white border border-cream-200 shadow-soft flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-0.5">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-lemon-400 text-lemon-400" />
                    ))}
                  </div>
                  <span className="text-[11px] text-charcoal-400 font-mono">{rev.date}</span>
                </div>
                <p className="text-xs text-charcoal-600 leading-relaxed">
                  {rev.body}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-cream-200 flex items-center gap-2">
                <MessageSquare className="w-3.5 h-3.5 text-leaf-600" />
                <h6 className="font-display font-bold text-xs text-botanical-950">{rev.name}</h6>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
