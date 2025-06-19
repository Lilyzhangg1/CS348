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

  return (
    <div>
      <h2>Restaurants</h2>
      <div>
        {restaurants.map(r => (
          <RestaurantCard key={r.placeId} r={r} />
        ))}
      </div>

      <button onClick={() => setPage(p => Math.max(p - 1, 1))}>◀ Prev</button>
      <button onClick={() => setPage(p => p + 1)}>Next ▶</button>
    </div>
  );
}
