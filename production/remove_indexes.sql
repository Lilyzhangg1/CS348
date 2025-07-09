-- friendship indexes
DROP INDEX IF EXISTS idx_friendship_userA;
DROP INDEX IF EXISTS idx_friendship_userB;

-- friendRequest indexes
DROP INDEX IF EXISTS idx_friend_request_requesteeId;
DROP INDEX IF EXISTS idx_friend_request_requesterId;

-- rating indexes
DROP INDEX IF EXISTS idx_rating_placeId;

-- wishlist index
DROP INDEX IF EXISTS idx_wishlist_userId;

-- restaurant indexes
DROP INDEX IF EXISTS idx_restaurant_name;
DROP INDEX IF EXISTS idx_restaurant_city;
DROP INDEX IF EXISTS idx_restaurant_postalCode;

-- user indexes
DROP INDEX IF EXISTS idx_user_userId;
DROP INDEX IF EXISTS idx_user_firstName;
DROP INDEX IF EXISTS idx_user_lastName;
