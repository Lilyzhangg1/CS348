import React, { useEffect, useState } from 'react';
import API from '../api/api';
import RestaurantCard from '../components/RestaurantCard';
import styles from './Restaurants.module.css';  // ← new import
import backgroundImage from '../assets/background.jpeg'; // ← new import

function TopRatedCard() {
  const [top, setTop] = useState([]);
  useEffect(() => {
    API.get('/top-rated-weekly').then(res => setTop(res.data));
  }, []);
  if (!top.length) return null;
  return (
    <div style={{
      backgroundImage: `url(${backgroundImage})`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center center',
      backgroundSize: 'cover'
    }}>
      <h3 style={{ color: '#b48a00', marginTop: 0 }}>Top 3 Rated This Week</h3>
      <ol style={{ paddingLeft: '1.2rem', margin: 0 }}>
        {top.map((r, i) => (
          <li key={r.placeId} style={{ marginBottom: '0.7rem', fontWeight: 500 }}>
            <span style={{ color: '#7c5a00', fontWeight: 700 }}>{r.name}</span>
            <span style={{ color: '#b48a00', marginLeft: 8 }}>({r.avgRating}★ avg)</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function Restaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [orderByRating, setOrderByRating] = useState(false);

  useEffect(() => {
    let url = `/restaurants?page=${page}`;
    if (searchTerm) {
      url += `&search=${encodeURIComponent(searchTerm)}`;
    }
    if (orderByRating) {
      url += `&order=rating`;
    }
    API.get(url)
      .then(res => {
        console.log("✅ Restaurants:", res.data);
        setRestaurants(res.data);
      })
      .catch(console.error);
  }, [page, searchTerm, orderByRating]);

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
  const handleSearch = (e) => {
    e.preventDefault();
    setSearchTerm(search);
    setPage(1);
  };

  return (
    <div style={{ paddingBottom: "1.5rem" }}>
      <TopRatedCard />

      <h2>Restaurants</h2>
      <form
        onSubmit={handleSearch}
        style={{
          marginBottom: "1.5rem",
          display: "flex",
          gap: "0.5rem",
          alignItems: "center"
        }}
      >
        <input
          type="text"
          placeholder="Search restaurants..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "9999px",
            border: "1px solid #F0E68C",
            fontSize: "1rem",
            flex: 1
          }}
        />
        <button
          type="submit"
          style={btnStyle}
          onMouseOver={e => (e.currentTarget.style.backgroundColor = hoverStyle.backgroundColor)}
          onMouseOut={e => (e.currentTarget.style.backgroundColor = btnStyle.backgroundColor)}
        >
          Search
        </button>
        <button
          type="button"
          style={{ ...btnStyle, backgroundColor: orderByRating ? '#ffe082' : btnStyle.backgroundColor }}
          onMouseOver={e => (e.currentTarget.style.backgroundColor = hoverStyle.backgroundColor)}
          onMouseOut={e => (e.currentTarget.style.backgroundColor = orderByRating ? '#ffe082' : btnStyle.backgroundColor)}
          onClick={() => { setOrderByRating(v => !v); setPage(1); }}
        >
          {orderByRating ? 'Order: Rating' : 'Order: Name'}
        </button>
      </form>

      {/* ← wrap your cards in a grid container: */}
      <div className={styles.grid}>
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
