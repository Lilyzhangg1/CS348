CREATE TABLE Restaurant (
    placeId VARCHAR(100) PRIMARY KEY,
    name VARCHAR(100),
    street VARCHAR(100),
    city VARCHAR(100),
    postalCode VARCHAR(20)
);

CREATE TABLE User (
    userId VARCHAR(50) PRIMARY KEY,
    firstName VARCHAR(50),
    lastName VARCHAR(50),
    password VARCHAR(255)
);

CREATE TABLE Wishlist (
    placeId VARCHAR(100),
    userId VARCHAR(50),
    addedDate DATE,
    PRIMARY KEY (placeId, userId),
    FOREIGN KEY (userId) REFERENCES User(userId),
    FOREIGN KEY (placeId) REFERENCES Restaurant(placeId)
);

CREATE TABLE Rating (
    placeId VARCHAR(100),
    userId VARCHAR(50),
    rating INT CHECK (rating >= 1 AND rating <= 5),
    ratingDate DATE,
    comment TEXT,
    PRIMARY KEY (placeId, userId),
    FOREIGN KEY (userId) REFERENCES User(userId),
    FOREIGN KEY (placeId) REFERENCES Restaurant(placeId)
);

CREATE TABLE FriendRequest (
  requesterId TEXT NOT NULL,
  requesteeId  TEXT NOT NULL,
  requestDate  DATE    NOT NULL DEFAULT (DATE('now')),
  status       TEXT    NOT NULL CHECK(status IN ('pending','accepted','rejected')),
  PRIMARY KEY (requesterId, requesteeId),
  FOREIGN KEY (requesterId) REFERENCES User(userId),
  FOREIGN KEY (requesteeId)  REFERENCES User(userId)
);

CREATE TABLE Friendship (
  userA TEXT NOT NULL,
  userB TEXT NOT NULL,
  friendedDate DATE NOT NULL DEFAULT (DATE('now')),
  PRIMARY KEY (userA, userB),
  FOREIGN KEY (userA) REFERENCES User(userId),
  FOREIGN KEY (userB) REFERENCES User(userId),
  CHECK (userA < userB)
);
