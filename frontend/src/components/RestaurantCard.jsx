// RestaurantCard.jsx
import React from "react";
import styles from "./RestaurantCard.module.css";
import { FaStar, FaHeart, FaShareAlt } from "react-icons/fa";

export default function RestaurantCard({ r }) {
  return (
    <div className={styles.card}>
      {r.isNew && <div className={styles.card__badge}>NEW!</div>}

      <div className={styles.card__header}>{r.name}</div>
      <div className={styles.card__subheader}>
        {r.street}, {r.city} {r.postalCode}
      </div>

      <div className={styles.card__footer}>
        <div className={styles.card__rating}>
          <FaStar />
          <span style={{ marginLeft: "0.25rem" }}>
            {r.avgRating ?? "No ratings yet"}
          </span>
        </div>
        <div className={styles.card__actions}>
          <FaHeart />
          <FaShareAlt style={{ marginLeft: "0.5rem" }} />
        </div>
      </div>
    </div>
  );
}
