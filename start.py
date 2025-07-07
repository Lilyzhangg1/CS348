import os
import sqlite3
import subprocess

# Paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROD_DIR = os.path.join(BASE_DIR, "production")
DB_DIR = "/data"  # Railway persistent volume
DB_FILE = "waterlooeats.db"
DB_PATH = os.path.join(DB_DIR, DB_FILE)
SCHEMA_UP = os.path.join(BASE_DIR, "db", "tables_up.sql")
DATA_SCRIPT = os.path.join(PROD_DIR, "insert_production.py")


def initialize_database():
    """
    Creates waterlooeats.db and runs tables_up.sql
    """
    print("🔧 Initializing database schema...")
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()

    with open(SCHEMA_UP, "r", encoding="utf-8") as f:
        schema_sql = f.read()
        cur.executescript(schema_sql)

    conn.commit()
    conn.close()
    print("✅ Schema creation complete.")


def load_production_data():
    """
    Runs the insert.production.py script to populate database.
    """
    print("📥 Loading production data...")
    subprocess.run(["python3", DATA_SCRIPT], check=True)
    print("✅ Production data loaded.")


def main():
    # Ensure /data directory exists
    os.makedirs(DB_DIR, exist_ok=True)

    if os.path.exists(DB_PATH):
        print("✅ Database already exists in /data. Skipping schema creation and data load.")
    else:
        print("📂 waterlooeats.db not found. Creating and initializing...")
        initialize_database()
        load_production_data()

    # Start FastAPI app
    print("🚀 Starting FastAPI app...")
    subprocess.run([
        "uvicorn", "backend.main:app",
        "--host", "0.0.0.0",
        "--port", os.getenv("PORT", "8000")
    ])


if __name__ == "__main__":
    main()
