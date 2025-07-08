import sqlite3

#volime mounted on railway
# DB_PATH = "/data/waterlooeats.db"
DB_PATH = "production/waterlooeats.db"

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn
