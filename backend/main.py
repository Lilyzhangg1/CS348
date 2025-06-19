from fastapi import FastAPI, HTTPException, Depends, Query
from pydantic import BaseModel
import sqlite3
from typing import List
import hashlib
from models.user_create_request import UserCreate
from models.user_login_request import UserLogin
from models.get_restaurants_response import RestaurantOut
app = FastAPI()
DB = "../sample/waterlooeats.db" # we'll change to production after generating production set

# --------------------- UTILS ---------------------

def get_db():
    conn = sqlite3.connect(DB)
    conn.row_factory = sqlite3.Row
    return conn

def hash_password(pw: str):
    return hashlib.sha256(pw.encode()).hexdigest()

# --------------------- ROUTES ---------------------

@app.post("/signup")
def signup(user: UserCreate):
    conn = get_db()
    cur = conn.cursor()
    try:
        cur.execute("""
            INSERT INTO User (userId, firstName, lastName, password)
            VALUES (?, ?, ?, ?)
        """, (user.userId, user.firstName, user.lastName, hash_password(user.password)))
        conn.commit()
    except sqlite3.IntegrityError:
        raise HTTPException(status_code=409, detail="User already exists")
    return {"message": "User created successfully"}

@app.post("/login")
def login(user: UserLogin):
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT password FROM User WHERE userId = ?", (user.userId,))
    row = cur.fetchone()
    if not row or row["password"] != hash_password(user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"message": "Login successful"}

@app.get("/restaurants", response_model=List[RestaurantOut])
def get_restaurants(page: int = Query(1, ge=1)):
    page_size = 10
    offset = (page - 1) * page_size

    conn = get_db()
    cur = conn.cursor()
    cur.execute("""
        SELECT r.placeId, r.name, r.street, r.city, r.postalCode,
               ROUND(AVG(rt.rating), 2) as avgRating
        FROM Restaurant r
        LEFT JOIN Rating rt ON r.placeId = rt.placeId
        GROUP BY r.placeId
        ORDER BY r.name
        LIMIT ? OFFSET ?
    """, (page_size, offset))

    return [dict(row) for row in cur.fetchall()]
