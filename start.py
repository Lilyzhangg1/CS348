import os
import subprocess

# Paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROD_DIR = os.path.join(BASE_DIR, "production")
DB_FILE = "waterlooeats.db"
SCHEMA_UP = os.path.join(BASE_DIR, "db", "tables_up.sql")
DATA_SCRIPT = "insert.production.py"

# Step 1: Change to production directory
print(f"📂 Switching to production directory: {PROD_DIR}")
os.chdir(PROD_DIR)

# Step 2: Check if DB exists
if os.path.exists(DB_FILE):
    print("✅ Database already exists. Skipping schema creation and data load.")
else:
    print("🔧 Creating new waterlooeats.db and loading schema/data...")

    # Create schema
    subprocess.run(
        ["sqlite3", DB_FILE, f".read {SCHEMA_UP}"],
        check=True
    )

    # Load production data
    print("📥 Loading production data...")
    subprocess.run(
        ["python3", DATA_SCRIPT],
        check=True
    )

# Step 3: Change back to root directory
print(f"📂 Returning to root directory: {BASE_DIR}")
os.chdir(BASE_DIR)

# Step 4: Start Uvicorn in production mode
print("🚀 Starting FastAPI app...")
subprocess.run([
    "uvicorn", "backend.main:app",
    "--host", "0.0.0.0", "--port", os.getenv("PORT", "8000")
])
