export default function RestaurantCard({ r }) {
  return (
    <div
      style={{
        backgroundColor: "#FFF9C4",
        border: "1px solid #F0E68C",
        borderRadius: "8px",
        margin: "10px 0",
        padding: "10px",
      }}
    >
      <h3>{r.name}</h3>
      <p>{r.street}, {r.city} {r.postalCode}</p>
      <p>⭐ {r.avgRating ?? "No ratings yet"}</p>
    </div>
  );
}
