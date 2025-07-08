import React, { useState } from 'react';
import API from '../api/api';
import styles from './RatingModal.module.css';

export default function RatingModal({
  placeId,
  restaurantName,
  initialRating = 5,
  initialComment = '',
  onClose,
  onSave,
}) {
  const [rating, setRating] = useState(initialRating);
  const [comment, setComment] = useState(initialComment);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    const userId = localStorage.getItem('userId');
    setIsSubmitting(true);
    try {
      await API.post('/rating', { userId, placeId, rating, comment });
      onClose();
    } catch (err) {
      alert(err.response?.data?.detail || 'Could not submit rating');
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <h3 className={styles.title}>
          {restaurantName}
        </h3>
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
            <button type="button" disabled={isSubmitting} onClick={onClose}>
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
