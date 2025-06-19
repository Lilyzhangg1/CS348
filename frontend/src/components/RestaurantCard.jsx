import React from 'react';

export default function RestaurantCard({ r }) {
  return (
    <div style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
      <h3>{r.name}</h3>
      <p>{r.street}, {r.city} {r.postalCode}</p>
      <p>⭐ {r.avgRating ?? "No ratings yet"}</p>
    </div>
  );
}
