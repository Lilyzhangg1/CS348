import React, { useEffect, useState } from "react";
import API from "../api/api";
import RestaurantCard from "../components/RestaurantCard";

export default function Wishlist() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    API.get(`/wishlist/${userId}`)
      .then(res => {
        setRestaurants(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [userId]);

  if (!userId) {
    return <div style={{ marginTop: "2rem", textAlign: "center" }}>Log in to view your wishlist.</div>;
  }
  if (loading) {
    return <div style={{ marginTop: "2rem", textAlign: "center" }}>Loading...</div>;
  }
  if (restaurants.length === 0) {
    return <div style={{ marginTop: "2rem", textAlign: "center" }}>Your wishlist is empty.</div>;
  }
  return (
    <div>
      <h2>My Wishlist</h2>
      <div>
        {restaurants.map(r => (
          <RestaurantCard key={r.placeId} r={r} />
        ))}
      </div>
    </div>
  );
}
