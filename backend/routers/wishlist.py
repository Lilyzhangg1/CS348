from fastapi import APIRouter, HTTPException
from typing import List
from backend.models.wishlist_request import WishlistAddRequest
from backend.models.get_restaurants_response import RestaurantOut
from backend.db import get_db
from datetime import date
import sqlite3

router = APIRouter()

@router.post("")
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
    finally:
        conn.close()
    return {"message": "Added to wishlist"}

@router.get("/{user_id}", response_model=List[RestaurantOut])
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

@router.get("{user_id}/check/{place_id}")
def check_wishlist_status(user_id: str, place_id: str):
    conn = get_db()
    cur = conn.cursor()
    cur.execute(
        "SELECT 1 FROM Wishlist WHERE userId = ? AND placeId = ?",
        (user_id, place_id)
    )
    is_in_wishlist = cur.fetchone() is not None
    conn.close()
    return {"isInWishlist": is_in_wishlist}

@router.delete("")
def remove_from_wishlist(req: WishlistAddRequest):
    conn = get_db()
    cur = conn.cursor()
    cur.execute(
        "DELETE FROM Wishlist WHERE userId = ? AND placeId = ?",
        (req.userId, req.placeId)
    )
    conn.commit()
    conn.close()
    return {"message": "Removed from wishlist"}
