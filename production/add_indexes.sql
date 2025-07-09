-- user indexes
CREATE INDEX idx_user_userId ON User(userId);
CREATE INDEX idx_user_firstName ON User(firstName);
CREATE INDEX idx_user_lastName ON User(lastName);

-- restaurant indexes
CREATE INDEX idx_restaurant_name ON Restaurant(name);
CREATE INDEX idx_restaurant_city ON Restaurant(city);
CREATE INDEX idx_restaurant_postalCode ON Restaurant(postalCode);

-- wishlist index for faster lookups
CREATE INDEX idx_wishlist_userId ON Wishlist(userId);

-- rating index for faster place lookups
CREATE INDEX idx_rating_placeId ON Rating(placeId);

-- friendRequest indexes
CREATE INDEX idx_friend_request_requesteeId ON FriendRequest(requesteeId);
CREATE INDEX idx_friend_request_requesterId ON FriendRequest(requesterId);

-- friendship index for user lookups
CREATE INDEX idx_friendship_userA ON Friendship(userA);
CREATE INDEX idx_friendship_userB ON Friendship(userB);

