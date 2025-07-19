import React, { useEffect, useState } from "react";
import API from "../api/api";
import RestaurantCard from "../components/RestaurantCard";
import styles from "./Restaurants.module.css";

function TopRatedSection() {
  const [top, setTop] = useState([]);

  useEffect(() => {
    API.get("/top-rated-weekly")
      .then((res) => setTop(res.data))
      .catch(() => {});
  }, []);

  if (top.length === 0) return null;

  return (
    <section style={{ marginBottom: "2rem" }}>
      <h2 style={{ marginTop: 0, marginBottom: "1rem" }}>
        Top 3 Rated This Week
      </h2>
      <div className={styles.grid}>
        {top.map((r) => (
          <RestaurantCard key={r.placeId} r={r} hideImage={true} />
        ))}
      </div>
    </section>
  );
}

export default function Restaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [orderByRating, setOrderByRating] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    let url = `/restaurants?page=${page}`;
    if (searchTerm) {
      url += `&search=${encodeURIComponent(searchTerm)}`;
    }
    if (orderByRating) {
      url += `&order=rating`;
    }
    API.get(url)
      .then((res) => {
        console.log("✅ Restaurants:", res.data);
        setRestaurants(res.data);
        // If we get fewer than 12 items, there are no more pages
        setHasMore(res.data.length === 12);
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
    <div style={{ padding: "1rem" }}>
      <TopRatedSection />

      <h2>Restaurants</h2>

      <form onSubmit={handleSearch} className={styles.searchWrapper}>
        <div className={styles.searchBar}>
          <button
            type="button"
            className={styles.iconBtn}
            aria-label="Menu / Filters"
            onClick={() => {
              /* placeholder for future filter panel */
            }}
          >
            &#9776;
          </button>

          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search for restaurants"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button type="submit" className={styles.iconBtn} aria-label="Search">
            🔍
          </button>
        </div>

        <button
          type="button"
          className={`${styles.pillBtn} ${
            orderByRating ? styles.orderActive : ""
          }`}
          onClick={() => {
            setOrderByRating((v) => !v);
            setPage(1);
          }}
        >
          {orderByRating ? "Order: Rating" : "Order: Name"}
        </button>
      </form>

      <div className={styles.grid}>
        {restaurants.map((r) => (
          <RestaurantCard key={r.placeId} r={r} />
        ))}
      </div>

      <div style={{ marginTop: "1rem", textAlign: "center" }}>
        <button
          className={styles.pillBtn}
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
        >
          ◀ Prev
        </button>
        <button
          className={styles.pillBtn}
          onClick={() => setPage((p) => p + 1)}
          disabled={!hasMore}
        >
          Next ▶
        </button>
      </div>
    </div>
  );
}
