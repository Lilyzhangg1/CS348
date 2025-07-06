from fastapi import APIRouter, HTTPException, Depends
from backend.models.user_create_request import UserCreate
from backend.models.user_login_request  import UserLogin
from backend.db import get_db
from backend.utils import hash_password
import sqlite3

router = APIRouter()

@router.post("/signup")
def signup(user: UserCreate):
    conn = get_db(); cur = conn.cursor()
    try:
        cur.execute(
            "INSERT INTO User (userId, firstName, lastName, password) VALUES (?, ?, ?, ?)",
            (user.userId, user.firstName, user.lastName, hash_password(user.password))
        )
        conn.commit()
    except sqlite3.IntegrityError:
        raise HTTPException(409, "User already exists")
    return {"message": "User created successfully"}

@router.post("/login")
def login(user: UserLogin):
    conn = get_db(); cur = conn.cursor()
    cur.execute("SELECT password FROM User WHERE userId = ?", (user.userId,))
    row = cur.fetchone()
    if not row or row["password"] != hash_password(user.password):
        raise HTTPException(401, "Invalid credentials")
    return {"message": "Login successful"}
