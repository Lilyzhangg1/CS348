# models/friend_rating_response.py
from pydantic import BaseModel
from typing import Optional
from datetime import date

class FriendRatingOut(BaseModel):
    friendId: str
    placeId: str
    restaurantName: str
    rating: int
    ratingDate: date
    comment: Optional[str] = None
