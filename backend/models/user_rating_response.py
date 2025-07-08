from pydantic import BaseModel
from datetime import date

class UserRatingOut(BaseModel):
    placeId: str
    name: str
    street: str
    city: str
    postalCode: str
    rating: int
    comment: str
    ratingDate: date
