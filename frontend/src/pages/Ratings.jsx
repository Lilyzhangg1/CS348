import React, { useEffect, useState } from 'react';
import API from '../api/api';
import RatingCard from '../components/RatingCard';

export default function MyRatings() {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem('userId');

  const fetchRatings = () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    API.get(`/users/${userId}/ratings`)
      .then(res => {
        setRatings(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchRatings();
  }, [userId]);

  if (!userId) {
    return (
      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        Log in to view your ratings.
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        Loading…
      </div>
    );
  }

  if (ratings.length === 0) {
    return (
      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        You haven’t rated anything yet!
      </div>
    );
  }

  return (
    <div style={{ padding: '1rem' }}>
      <h2>My Ratings</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        {ratings.map(r => (
          <RatingCard key={r.placeId + r.ratingDate} r={r} onRatingUpdated={fetchRatings} />
        ))}
      </div>
    </div>
  );
}
