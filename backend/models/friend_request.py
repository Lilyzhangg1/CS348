from pydantic import BaseModel

class FriendRequestIn(BaseModel):
    requesterId: str
    requesteeId: str

class FriendResponseIn(BaseModel):
    requesterId: str
    requesteeId: str
    accept: bool

class RemoveFriendRequest(BaseModel):
    userId: str
    friendId: str
