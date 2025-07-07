from fastapi import APIRouter, Query
from typing import List
from backend.db import get_db
from backend.models.user_search_response import UserSearchOut

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
