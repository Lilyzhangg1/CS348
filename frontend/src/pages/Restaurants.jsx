import React, { useEffect, useState } from 'react';
import API from '../api/api';
import RestaurantCard from '../components/RestaurantCard';

export default function Restaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    API.get(`/restaurants?page=${page}`)
      .then(res => {
        console.log("✅ Restaurants:", res.data);  // Good to keep for debugging
        setRestaurants(res.data);
      })
      .catch(console.error);
  }, [page]);

  const btnStyle = {
    backgroundColor: "#FFF9C4",      // light yellow
    border: "1px solid #F0E68C",      // slightly darker
    borderRadius: "9999px",           // full pill
    padding: "0.5rem 1rem",           // comfy click target
    margin: "0 0.25rem",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "background-color .2s",
  };
  const hoverStyle = { backgroundColor: "#FFEE99" };

  return (
    <div>
      <h2>Restaurants</h2>
      <div>
        {restaurants.map(r => (
          <RestaurantCard key={r.placeId} r={r} />
        ))}
      </div>

      <div style={{ marginTop: "1rem", textAlign: "center" }}>
        <button
          style={btnStyle}
          onMouseOver={e => (e.currentTarget.style.backgroundColor = hoverStyle.backgroundColor)}
          onMouseOut={e => (e.currentTarget.style.backgroundColor = btnStyle.backgroundColor)}
          onClick={() => setPage(p => Math.max(p - 1, 1))}
        >
          ◀ Prev
        </button>
        <button
          style={btnStyle}
          onMouseOver={e => (e.currentTarget.style.backgroundColor = hoverStyle.backgroundColor)}
          onMouseOut={e => (e.currentTarget.style.backgroundColor = btnStyle.backgroundColor)}
          onClick={() => setPage(p => p + 1)}
        >
          Next ▶
        </button>
      </div>
    </div>
  );
}
