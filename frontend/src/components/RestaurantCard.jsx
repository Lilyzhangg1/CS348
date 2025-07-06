// RestaurantCard.jsx

import React from 'react';
import { MoonStarIcon, HeartIcon, ArrowDownIcon } from 'raster-react';
import styles from './RestaurantCard.module.css';

export default function RestaurantCard({ r }) {
  return (
    <div className={styles.card}>
      {/* — Name / “Speaker” badge spot (we’ll drop it for restaurants) — */}
      <h3 className={styles.title}>{r.name}</h3>

      {/* — Address — */}
      <p className={styles.address}>
        {r.street}, {r.city} {r.postalCode}
      </p>

      {/* — Placeholder for an image (if you ever add one) — */}
      <div className={styles.imagePlaceholder}>
        <span>Restaurant Image</span>
      </div>

      {/* — Rating + actions bar — */}
      <div className={styles.footer}>
        <div className={styles.rating}>
          <MoonStarIcon size={16} strokeWidth={0.25} />
          <span className={styles.ratingText}>
            {r.avgRating ?? 'No ratings yet'}
          </span>
        </div>
        <div className={styles.actions}>
          <HeartIcon size={16} strokeWidth={0.25} />
          <ArrowDownIcon size={16} strokeWidth={0.25} />
        </div>
      </div>
    </div>
  );
}
