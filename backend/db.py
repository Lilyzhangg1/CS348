import sqlite3
import os

# Use local database for development, production database for deployment
if os.path.exists("/data/waterlooeats.db"):
    # Production environment (Railway)
    DB_PATH = "/data/waterlooeats.db"
else:
    # Local development environment
    DB_PATH = "waterlooeats.db"

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn
