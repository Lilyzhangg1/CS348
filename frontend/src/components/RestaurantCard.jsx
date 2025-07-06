// RestaurantCard.jsx
import React from "react";
import styles from "./RestaurantCard.module.css";
import { FaStar, FaHeart, FaShareAlt } from "react-icons/fa";
import API from "../api/api";

export default function RestaurantCard({ r }) {
  const handleWishlist = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("You must be logged in to add to wishlist.");
      return;
    }
    try {
      await API.post("/wishlist", { userId, placeId: r.placeId });
      alert("Added to wishlist!");
    } catch (err) {
      alert(err.response?.data?.detail || "Could not add to wishlist");
    }
  };

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
          <FaHeart style={{ cursor: "pointer" }} onClick={handleWishlist} />
          <FaShareAlt style={{ marginLeft: "0.5rem" }} />
        </div>
      </div>
    </div>
  );
}
