from pydantic import BaseModel

class UserSearchOut(BaseModel):
    userId: str
    firstName: str
    lastName: str
