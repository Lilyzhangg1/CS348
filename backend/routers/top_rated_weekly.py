from fastapi import APIRouter, HTTPException
from typing import List
from backend.models.top_rated_response import TopRatedOut
from backend.db import get_db
from datetime import date
from datetime import timedelta
router = APIRouter()

@router.get("", response_model=List[TopRatedOut])
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
