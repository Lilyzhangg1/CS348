from fastapi import FastAPI, HTTPException, Depends, Query
from pydantic import BaseModel
import sqlite3
from typing import List
import hashlib
from models.user_create_request import UserCreate
from models.user_login_request import UserLogin
from models.get_restaurants_response import RestaurantOut
from fastapi.middleware.cors import CORSMiddleware
from datetime import date, timedelta

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB = "../production/waterlooeats.db"

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
def get_restaurants(page: int = Query(1, ge=1), search: str = Query(None), order: str = Query(None)):
    page_size = 10
    offset = (page - 1) * page_size

    conn = get_db()
    cur = conn.cursor()
    order_clause = "ORDER BY avgRating DESC" if order == "rating" else "ORDER BY r.name"
    if search:
        cur.execute(f"""
            SELECT r.placeId, r.name, r.street, r.city, r.postalCode,
                   ROUND(AVG(rt.rating), 2) as avgRating
            FROM Restaurant r
            LEFT JOIN Rating rt ON r.placeId = rt.placeId
            WHERE r.name LIKE ?
            GROUP BY r.placeId
            {order_clause}
            LIMIT ? OFFSET ?
        """, (f"%{search}%", page_size, offset))
    else:
        cur.execute(f"""
            SELECT r.placeId, r.name, r.street, r.city, r.postalCode,
                   ROUND(AVG(rt.rating), 2) as avgRating
            FROM Restaurant r
            LEFT JOIN Rating rt ON r.placeId = rt.placeId
            GROUP BY r.placeId
            {order_clause}
            LIMIT ? OFFSET ?
        """, (page_size, offset))

    return [dict(row) for row in cur.fetchall()]

class WishlistAddRequest(BaseModel):
    userId: str
    placeId: str

@app.post("/wishlist")
def add_to_wishlist(req: WishlistAddRequest):
    conn = get_db()
    cur = conn.cursor()
    try:
        cur.execute(
            "INSERT INTO Wishlist (userId, placeId, addedDate) VALUES (?, ?, ?)",
            (req.userId, req.placeId, date.today())
        )
        conn.commit()
    except sqlite3.IntegrityError:
        raise HTTPException(status_code=409, detail="Already in wishlist")
    return {"message": "Added to wishlist"}

@app.get("/wishlist/{user_id}", response_model=List[RestaurantOut])
def get_wishlist(user_id: str):
    conn = get_db()
    cur = conn.cursor()
    cur.execute(
        """
        SELECT r.placeId, r.name, r.street, r.city, r.postalCode,
               ROUND(AVG(rt.rating), 2) as avgRating
        FROM Wishlist w
        JOIN Restaurant r ON w.placeId = r.placeId
        LEFT JOIN Rating rt ON r.placeId = rt.placeId
        WHERE w.userId = ?
        GROUP BY r.placeId
        ORDER BY w.addedDate DESC
        """,
        (user_id,)
    )
    return [dict(row) for row in cur.fetchall()]

class TopRatedOut(BaseModel):
    placeId: str
    name: str
    street: str
    city: str
    postalCode: str
    avgRating: float

@app.get("/top-rated-weekly", response_model=List[TopRatedOut])
def top_rated_weekly():
    conn = get_db()
    cur = conn.cursor()
    week_ago = (date.today() - timedelta(days=7)).isoformat()
    cur.execute(
        """
        SELECT r.placeId, r.name, r.street, r.city, r.postalCode,
               ROUND(AVG(rt.rating), 2) as avgRating
        FROM Rating rt
        JOIN Restaurant r ON rt.placeId = r.placeId
        WHERE rt.ratingDate >= ?
        GROUP BY r.placeId
        HAVING COUNT(rt.rating) > 0
        ORDER BY avgRating DESC, r.name ASC
        LIMIT 3
        """,
        (week_ago,)
    )
    return [dict(row) for row in cur.fetchall()]
