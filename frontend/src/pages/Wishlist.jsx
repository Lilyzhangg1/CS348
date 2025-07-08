import React, { useEffect, useState } from "react";
import API from "../api/api";
import RestaurantCard from "../components/RestaurantCard";
import styles from './Wishlist.module.css';  // ← new import

export default function Wishlist() {
  const [allRestaurants, setAllRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const userId = localStorage.getItem("userId");
  const itemsPerPage = 12;

  const loadWishlist = () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    API.get(`/wishlist/${userId}`)
      .then(res => {
        setAllRestaurants(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("❌ Wishlist error:", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadWishlist();
  }, [userId]);

  // Listen for wishlist changes from other components
  useEffect(() => {
    const handleWishlistChange = () => {
      loadWishlist();
    };

    window.addEventListener('wishlistChanged', handleWishlistChange);
    return () => window.removeEventListener('wishlistChanged', handleWishlistChange);
  }, [userId]);

  // Calculate pagination
  const totalPages = Math.ceil(allRestaurants.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageRestaurants = allRestaurants.slice(startIndex, endIndex);

  const btnStyle = {
    backgroundColor: "#FFF9C4",
    border: "1px solid #F0E68C",
    borderRadius: "9999px",
    padding: "0.5rem 1rem",
    margin: "0 0.25rem",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "background-color .2s",
  };
  const hoverStyle = { backgroundColor: "#FFEE99" };

  if (!userId) {
    return <div style={{ marginTop: "2rem", textAlign: "center" }}>Log in to view your wishlist.</div>;
  }
  if (loading) {
    return <div style={{ marginTop: "2rem", textAlign: "center" }}>Loading...</div>;
  }
  if (allRestaurants.length === 0) {
    return <div style={{ marginTop: "2rem", textAlign: "center" }}>Your wishlist is empty.</div>;
  }
  return (
    <div style={{ paddingBottom: "1.5rem" }}>
      <h2>My Wishlist</h2>
      
      {/* ← wrap your cards in a grid container: */}
      <div className={styles.grid}>
        {currentPageRestaurants.map(r => (
          <RestaurantCard key={r.placeId} r={r} />
        ))}
      </div>

      <div style={{ marginTop: "1rem", textAlign: "center" }}>
        <button
          style={btnStyle}
          onMouseOver={e => (e.currentTarget.style.backgroundColor = hoverStyle.backgroundColor)}
          onMouseOut={e => (e.currentTarget.style.backgroundColor = btnStyle.backgroundColor)}
          onClick={() => setPage(p => Math.max(p - 1, 1))}
          disabled={page === 1}
        >
          ◀ Prev
        </button>
        <button
          style={btnStyle}
          onMouseOver={e => (e.currentTarget.style.backgroundColor = hoverStyle.backgroundColor)}
          onMouseOut={e => (e.currentTarget.style.backgroundColor = btnStyle.backgroundColor)}
          onClick={() => setPage(p => p + 1)}
          disabled={page >= totalPages}
        >
          Next ▶
        </button>
      </div>
    </div>
  );
}
