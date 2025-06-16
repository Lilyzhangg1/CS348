from pydantic import BaseModel

class RestaurantOut(BaseModel):
    placeId: str
    name: str
    street: str
    city: str
    postalCode: str
    avgRating: float = None
