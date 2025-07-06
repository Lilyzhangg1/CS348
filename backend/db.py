import sqlite3
# relative to CS348 directory
DB_PATH = "production/waterlooeats.db"

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn
