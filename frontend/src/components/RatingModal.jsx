import React, { useState } from 'react';
import API from '../api/api';
import styles from './RatingModal.module.css'; // we’ll create this

export default function RatingModal({ placeId, onClose }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('Please log in to rate.');
      return;
    }
    setIsSubmitting(true);
    try {
      await API.post('/rating', {
        userId,
        placeId,
        rating,
        comment,
      });
      alert('Thanks for your rating!');
      onClose();
      // Optionally, dispatch an event to refresh avgRating in parent
      window.dispatchEvent(new Event('ratingSubmitted'));
    } catch (err) {
      alert(err.response?.data?.detail || 'Could not submit rating');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={e => e.stopPropagation()}
      >
        <h3 className={styles.title}>Rate this place</h3>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label>
            Stars:
            <select
              value={rating}
              onChange={e => setRating(+e.target.value)}
              disabled={isSubmitting}
            >
              {[5,4,3,2,1].map(n => (
                <option key={n} value={n}>{n} ⭐</option>
              ))}
            </select>
          </label>
          <label>
            Comment:
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              disabled={isSubmitting}
              rows={3}
            />
          </label>
          <div className={styles.buttons}>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting…' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
