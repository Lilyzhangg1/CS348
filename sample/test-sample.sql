-- show all users
SELECT * FROM User;

-- show all restaurants
SELECT * FROM Restaurant LIMIT 5;

-- show all wishlist entries
SELECT * FROM Wishlist LIMIT 5;

-- show all ratings
SELECT * FROM Rating LIMIT 5;

-- show average ratting per restaurant
SELECT r.name, ROUND(AVG(rt.rating), 2) AS avg_rating
FROM Restaurant r
LEFT JOIN Rating rt ON r.placeId = rt.placeId
GROUP BY r.placeId
ORDER BY avg_rating DESC
LIMIT 5;

-- show all restaurants in Waterloo
SELECT * FROM Restaurant
WHERE city = 'Waterloo'
LIMIT 5;

-- show wishlist entries for a specific user
SELECT r.name, w.addedDate
FROM Wishlist w
JOIN Restaurant r ON w.placeId = r.placeId
WHERE w.userId = 'user1'
ORDER BY w.addedDate DESC;

-- show all ratings by a specific user
SELECT r.name, rt.rating, rt.ratingDate, rt.comment
FROM Rating rt
JOIN Restaurant r ON r.placeId = rt.placeId
WHERE rt.userId = 'user1'
ORDER BY rt.ratingDate DESC;
