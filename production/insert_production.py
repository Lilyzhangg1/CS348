import sqlite3
import json
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = "/data/waterlooeats.db"  # Railway mounted volume
RESTAURANT_FILE = os.path.join(BASE_DIR, "production.json")

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

def main():
    conn = sqlite3.connect(DB_PATH)
    print("📌 Inserting Restaurants...")
    insert_restaurants(conn)
    print("✅ Sample data successfully inserted.")
    conn.close()

if __name__ == "__main__":
    main()
