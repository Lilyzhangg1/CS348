import React, { useState } from 'react';
import { MoonStarIcon } from 'raster-react';
import { Edit2 } from 'lucide-react';
import styles from './RestaurantCard.module.css';
import RatingModal from './RatingModal';

export default function RatingCard({ r, onRatingUpdated }) {
  const [userRating, setUserRating] = useState({
    rating: r.rating,
    comment: r.comment,
    ratingDate: r.ratingDate,
  });
  const [showModal, setShowModal] = useState(false);

  const handleSave = ({ rating, comment, ratingDate }) => {
    setUserRating({ rating, comment, ratingDate });
    if (onRatingUpdated) {
      onRatingUpdated();
    }
  };

  return (
    <>
      <div className={styles.card}>
        <h3 className={styles.title}>{r.name || r.placeId}</h3>
        <p className={styles.address}>
           {r.street}, {r.city} {r.postalCode}
        </p>
        <div className={styles.footer}>
          <div className={styles.rating}>
            <MoonStarIcon size={16} strokeWidth={0.25} />
            <span className={styles.ratingText}>
              {userRating.rating}
            </span>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#666' }}>
            {new Date(userRating.ratingDate).toLocaleDateString()}
          </span>
          <Edit2
            size={16}
            strokeWidth={1.5}
            style={{ cursor: 'pointer', marginLeft: '0.5rem' }}
            onClick={() => setShowModal(true)}
          />
        </div>

        <p style={{ marginTop: '0.5rem', color: '#333' }}>
          {userRating.comment}
        </p>
      </div>

      {showModal && (
        <RatingModal
          placeId={r.placeId}
          restaurantName={r.name || r.placeId}
          initialRating={userRating.rating}
          initialComment={userRating.comment}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
