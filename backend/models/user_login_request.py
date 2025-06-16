from pydantic import BaseModel

class UserLogin(BaseModel):
    userId: str
    password: str