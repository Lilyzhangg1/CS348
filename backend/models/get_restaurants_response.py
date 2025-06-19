from pydantic import BaseModel
from typing import Optional

class RestaurantOut(BaseModel):
    placeId: str
    name: str
    street: str
    city: str
    postalCode: str
    avgRating: Optional[float] = None
