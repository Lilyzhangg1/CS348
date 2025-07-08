-- Show all users (limit to 10)
SELECT * FROM User LIMIT 10;

-- Show all restaurants (limit to 10)
SELECT * FROM Restaurant LIMIT 10;

-- Show all wishlist entries (limit to 10)
SELECT * FROM Wishlist LIMIT 10;

-- Show all ratings (limit to 10)
SELECT * FROM Rating LIMIT 10;

-- Average rating per restaurant (top 10 by rating)
SELECT r.name, ROUND(AVG(rt.rating), 2) AS avg_rating, COUNT(rt.rating) AS num_ratings
FROM Restaurant r
LEFT JOIN Rating rt ON r.placeId = rt.placeId
GROUP BY r.placeId
ORDER BY avg_rating DESC
LIMIT 10;

-- Restaurants in Waterloo (top 10 alphabetically)
SELECT * FROM Restaurant
WHERE city = 'Waterloo'
ORDER BY name
LIMIT 10;

-- Wishlist entries for user 'bk'
SELECT r.name, w.addedDate
FROM Wishlist w
JOIN Restaurant r ON w.placeId = r.placeId
WHERE w.userId = 'bk'
ORDER BY w.addedDate DESC
LIMIT 10;

-- Ratings by user 'lily'
SELECT r.name, rt.rating, rt.ratingDate, rt.comment
FROM Rating rt
JOIN Restaurant r ON r.placeId = r.placeId
WHERE rt.userId = 'lily'
ORDER BY rt.ratingDate DESC
LIMIT 10;

-- All friend requests (limit to 10)
SELECT * FROM FriendRequest LIMIT 10;

-- Friend requests received by 'mikayla'
SELECT fr.requesterId AS fromUser, fr.requestDate, fr.status
FROM FriendRequest fr
WHERE fr.requesteeId = 'mikayla'
ORDER BY fr.requestDate DESC
LIMIT 10;

-- Friend requests sent by 'bk'
SELECT fr.requesteeId AS toUser, fr.requestDate, fr.status
FROM FriendRequest fr
WHERE fr.requesterId = 'bk'
ORDER BY fr.requestDate DESC
LIMIT 10;

-- All friendships (limit to 10)
SELECT * FROM Friendship LIMIT 10;

-- All friends of 'lily'
SELECT CASE
           WHEN f.userA = 'lily' THEN f.userB
           ELSE f.userA
       END AS friendUserId, f.friendedDate
FROM Friendship f
WHERE f.userA = 'lily' OR f.userB = 'lily'
ORDER BY f.friendedDate DESC
LIMIT 10;

-- Top 10 most active users (by number of ratings)
SELECT u.userId, u.firstName, u.lastName, COUNT(r.rating) AS total_ratings
FROM User u
LEFT JOIN Rating r ON u.userId = r.userId
GROUP BY u.userId
ORDER BY total_ratings DESC
LIMIT 10;

-- Top 10 most wishlisted restaurants
SELECT r.name, COUNT(w.userId) AS wishlist_count
FROM Restaurant r
JOIN Wishlist w ON r.placeId = w.placeId
GROUP BY r.placeId
ORDER BY wishlist_count DESC
LIMIT 10;

-- Restaurants rated 5 stars by 'mikayla'
SELECT r.name, rt.ratingDate, rt.comment
FROM Rating rt
JOIN Restaurant r ON rt.placeId = r.placeId
WHERE rt.userId = 'mikayla' AND rt.rating = 5
ORDER BY rt.ratingDate DESC
LIMIT 10;

-- Friends of 'bk' and their average rating
SELECT f.friendUserId, ROUND(AVG(r.rating), 2) AS avg_friend_rating
FROM (
    SELECT CASE
               WHEN fr.userA = 'bk' THEN fr.userB
               ELSE fr.userA
           END AS friendUserId
    FROM Friendship fr
    WHERE fr.userA = 'bk' OR fr.userB = 'bk'
) f
LEFT JOIN Rating r ON r.userId = f.friendUserId
GROUP BY f.friendUserId
ORDER BY avg_friend_rating DESC
LIMIT 10;
