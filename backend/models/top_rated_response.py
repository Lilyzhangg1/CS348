from pydantic import BaseModel
class TopRatedOut(BaseModel):
    placeId: str
    name: str
    street: str
    city: str
    postalCode: str
    avgRating: float
