-- user indexes
CREATE INDEX IF NOT EXISTS idx_user_userId ON User(userId);
CREATE INDEX IF NOT EXISTS idx_user_firstName ON User(firstName);
CREATE INDEX IF NOT EXISTS idx_user_lastName ON User(lastName);

-- restaurant indexes
CREATE INDEX IF NOT EXISTS idx_restaurant_name ON Restaurant(name);
CREATE INDEX IF NOT EXISTS idx_restaurant_city ON Restaurant(city);
