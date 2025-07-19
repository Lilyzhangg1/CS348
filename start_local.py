import os
import sqlite3
import subprocess

# Paths for local development
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_DIR = BASE_DIR  # Use current directory instead of /data
DB_FILE = "waterlooeats.db"
DB_PATH = os.path.join(DB_DIR, DB_FILE)
SCHEMA_UP = os.path.join(BASE_DIR, "db", "tables_up.sql")

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

def main():
    if not os.path.exists(DB_PATH):
        print("📂 waterlooeats.db not found. Creating and initializing…")
        initialize_database()
    else:
        print("✅ Database already exists. Skipping schema creation.")

    # Start FastAPI app
    print("🚀 Starting FastAPI app…")
    subprocess.run([
        "uvicorn", "backend.main:app",
        "--host", "0.0.0.0",
        "--port", "8000",
        "--reload",  # Enable auto-reload for development
    ])

if __name__ == "__main__":
    main() 