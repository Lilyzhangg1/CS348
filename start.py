import os
import sqlite3
import subprocess

# Paths
BASE_DIR   = os.path.dirname(os.path.abspath(__file__))
PROD_DIR   = os.path.join(BASE_DIR, "production")
DB_DIR     = "/data"  # Railway persistent volume
DB_FILE    = "waterlooeats.db"
DB_PATH    = os.path.join(DB_DIR, DB_FILE)
SCHEMA_UP  = os.path.join(BASE_DIR, "db", "tables_up.sql")
DATA_SCRIPT= os.path.join(PROD_DIR, "insert_production.py")

TRIGGER_SQL = """
CREATE TRIGGER trg_remove_wishlist_after_rating
AFTER INSERT ON Rating
FOR EACH ROW
WHEN EXISTS (
  SELECT 1
    FROM Wishlist
   WHERE placeId = NEW.placeId
     AND userId  = NEW.userId
)
BEGIN
  DELETE FROM Wishlist
   WHERE placeId = NEW.placeId
     AND userId  = NEW.userId;
END;
"""

def initialize_database():
    """
    Creates waterlooeats.db and runs tables_up.sql
    """
    print("🔧 Initializing database schema…")
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    with open(SCHEMA_UP, "r", encoding="utf-8") as f:
        cur.executescript(f.read())
    conn.commit()
    conn.close()
    print("✅ Schema creation complete.")

def load_production_data():
    """
    Runs the insert_production.py script to populate database.
    """
    print("📥 Loading production data…")
    subprocess.run(["python3", DATA_SCRIPT], check=True)
    print("✅ Production data loaded.")

def ensure_trigger_exists():
    """
    Checks if trg_remove_wishlist_after_rating exists;
    if not, creates it in-place without touching any other tables.
    """
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute("""
        SELECT name
          FROM sqlite_master
         WHERE type='trigger'
           AND name=?
    """, ("trg_remove_wishlist_after_rating",))
    if not cur.fetchone():
        print("🔔 Trigger not found; creating trg_remove_wishlist_after_rating…")
        cur.executescript(TRIGGER_SQL)
        conn.commit()
    else:
        print("✅ Trigger already exists.")
    conn.close()

def main():
    # Ensure /data directory exists
    os.makedirs(DB_DIR, exist_ok=True)

    if not os.path.exists(DB_PATH):
        print("📂 waterlooeats.db not found. Creating and initializing…")
        initialize_database()
        load_production_data()
    else:
        print("✅ Database already exists. Skipping schema & data load.")

    ensure_trigger_exists()

    # Start FastAPI app
    print("🚀 Starting FastAPI app…")
    subprocess.run([
        "uvicorn", "backend.main:app",
        "--host", "0.0.0.0",
        "--port", os.getenv("PORT", "8000"),
        "--proxy-headers",
    ])

if __name__ == "__main__":
    main()
