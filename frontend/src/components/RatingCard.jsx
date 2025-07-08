// src/components/RatingCard.jsx

import React from 'react';
import { MoonStarIcon } from 'raster-react';
import styles from './RestaurantCard.module.css';  // reuse your card styling

export default function RatingCard({ r }) {
  return (
    <div className={styles.card}>
      {/* Restaurant name or placeId */}
      <h3 className={styles.title}>{r.name || r.placeId}</h3>

      {/* Rating and date */}
      <div className={styles.footer}>
        <div className={styles.rating}>
          <MoonStarIcon size={16} strokeWidth={0.25} />
          <span className={styles.ratingText}>{r.rating}</span>
        </div>
        <span style={{ fontSize: '0.75rem', color: '#666' }}>
          {new Date(r.ratingDate).toLocaleDateString()}
        </span>
      </div>

      {/* Comment */}
      <p style={{ marginTop: '0.5rem', color: '#333' }}>
        {r.comment}
      </p>
    </div>
  );
}
