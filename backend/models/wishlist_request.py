from pydantic import BaseModel
class WishlistAddRequest(BaseModel):
    userId: str
    placeId: str

