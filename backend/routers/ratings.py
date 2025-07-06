from fastapi import APIRouter, HTTPException
from typing import List
from backend.models.rating_request import RatingRequest
from backend.models.get_restaurants_response import RestaurantOut
from backend.db import get_db
from datetime import date
import sqlite3
router = APIRouter()

@router.post("")
def submit_rating(req: RatingRequest):
    """
    make or update a rating for a restaurant by a user.
    if the user has already rated this place, it replaces their previous rating.
    """
    conn = get_db()
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()

    cur.execute("SELECT 1 FROM User WHERE userId = ?", (req.userId,))
    if not cur.fetchone():
        raise HTTPException(status_code=404, detail="User not found")

    cur.execute("SELECT 1 FROM Restaurant WHERE placeId = ?", (req.placeId,))
    if not cur.fetchone():
        raise HTTPException(status_code=404, detail="Restaurant not found")

    try:
        # Insert or update the rating using ON CONFLICT!
        cur.execute("""
            INSERT INTO Rating (placeId, userId, rating, ratingDate, comment)
            VALUES (?, ?, ?, ?, ?)
            ON CONFLICT(placeId, userId) DO UPDATE
              SET rating = excluded.rating,
                  ratingDate = excluded.ratingDate,
                  comment = excluded.comment
        """, (
            req.placeId,
            req.userId,
            req.rating,
            date.today().isoformat(),
            req.comment
        ))
        conn.commit()
    except sqlite3.IntegrityError as e:
        # catch any FK errors or constraint violations, ggs, just return error
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        conn.close()

    return {"message": "Rating submitted successfully"}
