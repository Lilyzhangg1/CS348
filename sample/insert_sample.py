import sqlite3
import json
import random
from datetime import datetime, timedelta

DB_FILE = "waterlooeats.db"
RESTAURANT_FILE = "cleaned_restaurants.json"

NUM_USERS = 10
WISHLIST_ENTRIES = 30
RATING_ENTRIES = 30

first_names = ["Alice", "Bob", "Charlie", "Diana", "Ethan", "Fiona", "George", "Hannah", "Ian", "Julia"]
last_names = ["Smith", "Johnson", "Lee", "Brown", "Garcia", "Martin", "Davis", "Taylor", "Wilson", "Anderson"]

def random_date():
    start = datetime(2023, 1, 1)
    end = datetime(2024, 12, 31)
    return start + timedelta(days=random.randint(0, (end - start).days))

def insert_users(conn):
    cur = conn.cursor()
    users = []
    for i in range(NUM_USERS):
        user_id = f"user{i+1}"
        fname = first_names[i % len(first_names)]
        lname = last_names[i % len(last_names)]
        pw = f"hashed_password_{i}"  # Simulated hashed password
        users.append(user_id)
        cur.execute("INSERT OR IGNORE INTO User (userId, firstName, lastName, password) VALUES (?, ?, ?, ?)",
                    (user_id, fname, lname, pw))
    conn.commit()
    return users

def insert_restaurants(conn):
    cur = conn.cursor()
    with open(RESTAURANT_FILE, "r", encoding="utf-8") as f:
        restaurants = json.load(f)

    for r in restaurants:
        cur.execute("""
        INSERT OR IGNORE INTO Restaurant (placeId, name, street, city, postalCode)
        VALUES (?, ?, ?, ?, ?)
        """, (r["placeId"], r["name"], r["street"], r["city"], r["postalCode"]))
    conn.commit()
    return [r["placeId"] for r in restaurants]

def insert_wishlist(conn, users, places):
    cur = conn.cursor()
    for _ in range(WISHLIST_ENTRIES):
        user = random.choice(users)
        place = random.choice(places)
        date = random_date().strftime("%Y-%m-%d")
        try:
            cur.execute("INSERT OR IGNORE INTO Wishlist (placeId, userId, addedDate) VALUES (?, ?, ?)",
                        (place, user, date))
        except:
            continue
    conn.commit()

def insert_ratings(conn, users, places):
    comments = ["Great food!", "Would not recommend.", "Okay overall.", "Amazing vibe.", "Good service."]
    cur = conn.cursor()
    for _ in range(RATING_ENTRIES):
        user = random.choice(users)
        place = random.choice(places)
        rating = random.randint(1, 5)
        comment = random.choice(comments)
        date = random_date().strftime("%Y-%m-%d")
        try:
            cur.execute("""
            INSERT OR IGNORE INTO Rating (placeId, userId, rating, ratingDate, comment)
            VALUES (?, ?, ?, ?, ?)
            """, (place, user, rating, date, comment))
        except:
            continue
    conn.commit()

def main():
    conn = sqlite3.connect(DB_FILE)

    print("📌 Inserting Users...")
    users = insert_users(conn)

    print("📌 Inserting Restaurants...")
    places = insert_restaurants(conn)

    print("📌 Inserting Wishlist Entries...")
    insert_wishlist(conn, users, places)

    print("📌 Inserting Ratings...")
    insert_ratings(conn, users, places)

    print("✅ Sample data successfully inserted.")
    conn.close()

if __name__ == "__main__":
    main()
