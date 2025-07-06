from pydantic import BaseModel, Field
from typing import Optional
class RatingRequest(BaseModel):
    userId: str
    placeId: str
    rating: int = Field(..., ge=1, le=5, description="1–5 stars")
    comment: Optional[str] = None
