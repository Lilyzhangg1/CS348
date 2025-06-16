from pydantic import BaseModel

# request model for user creation
class UserCreate(BaseModel):
    userId: str
    firstName: str
    lastName: str
    password: str