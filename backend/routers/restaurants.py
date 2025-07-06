from fastapi import APIRouter, Query
from typing import List, Optional
from backend.models.get_restaurants_response import RestaurantOut
from backend.db import get_db

router = APIRouter()

@router.get("", response_model=List[RestaurantOut])
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
