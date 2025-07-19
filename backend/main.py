from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routers import auth, restaurants, wishlist, ratings, top_rated_weekly, friends, users
from datetime import date

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000",
                    "https://localhost:3000",],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# @app.middleware("http")
# async def log_requests(request, call_next):
#     print(f"🌐 {request.method} {request.url} - Origin: {request.headers.get('origin')}")
#     response = await call_next(request)
#     return response

# @app.middleware("http")
# async def log_cors_headers(request, call_next):
#     response = await call_next(request)
#     print(f"🌐 Response headers: {dict(response.headers)}")
#     return response


app.include_router(auth.router,prefix="/auth",tags=["auth"])
app.include_router(restaurants.router, prefix="/restaurants", tags=["restaurants"])
app.include_router(wishlist.router, prefix="/wishlist", tags=["wishlist"])
app.include_router(ratings.router, prefix="/rating",tags=["rating"])
app.include_router(top_rated_weekly.router, prefix="/top-rated-weekly", tags=["top-rated-weekly"])
app.include_router(friends.router, prefix="/friends", tags=["friends"])
app.include_router(users.router, prefix="/users", tags=["users"])
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
