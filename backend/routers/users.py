import sqlite3
from fastapi import APIRouter, Query
from typing import List
from backend.db import get_db
from backend.models.user_search_response import UserSearchOut
from backend.models.user_rating_response import UserRatingOut

router = APIRouter()

@router.get("/search", response_model=List[UserSearchOut])
def search_users(query: str = Query(..., min_length=1), page: int = 1, page_size: int = 10):
    """
    Search for users by first name, last name, or userId.
    """
    offset = (page - 1) * page_size

    conn = get_db()
    cur = conn.cursor()

    cur.execute("""
        SELECT userId, firstName, lastName
        FROM User
        WHERE firstName LIKE ? OR lastName LIKE ? OR userId LIKE ?
        ORDER BY firstName ASC, lastName ASC
        LIMIT ? OFFSET ?
    """, (
        f"%{query}%",
        f"%{query}%",
        f"%{query}%",
        page_size, offset
    ))

    users = [dict(row) for row in cur.fetchall()]
    conn.close()
    return users

@router.get("/{user_id}/ratings", response_model=List[UserRatingOut])
def get_user_ratings(user_id: str):
    """
    Return all ratings & comments submitted by a given user, most recent first.
    """
    conn = get_db()
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()

    # Verify user exists
    cur.execute("SELECT 1 FROM User WHERE userId = ?", (user_id,))
    if not cur.fetchone():
        conn.close()
        raise HTTPException(status_code=404, detail="User not found")

    # Fetch each rating with restaurant details
    cur.execute("""
        SELECT
            r.placeId,
            r.name,
            r.street,
            r.city,
            r.postalCode,
            rt.rating,
            rt.comment,
            rt.ratingDate
        FROM Rating rt
        JOIN Restaurant r ON rt.placeId = r.placeId
        WHERE rt.userId = ?
        ORDER BY rt.ratingDate DESC
    """, (user_id,))

    rows = cur.fetchall()
    conn.close()
    return [dict(row) for row in rows]