# routers/friends.py
from fastapi import APIRouter, HTTPException
from backend.db import get_db
from backend.models.friend_request import FriendRequestIn, FriendResponseIn, RemoveFriendRequest

router = APIRouter()

# send a friend request
@router.post("/request")
def send_friend_request(req: FriendRequestIn):
    conn = get_db(); cur = conn.cursor()

    if req.requesterId == req.requesteeId:
        raise HTTPException(400, "You cannot friend yourself")

    try:
        cur.execute("""
            INSERT INTO FriendRequest (requesterId, requesteeId, status)
            VALUES (?, ?, 'pending')
        """, (req.requesterId, req.requesteeId))
        conn.commit()
    except Exception as e:
        raise HTTPException(400, str(e))
    finally:
        conn.close()
    return {"message": "Friend request sent"}

# get incoming friend requests
@router.get("/requests/incoming/{user_id}")
def get_incoming_requests(user_id: str):
    conn = get_db(); cur = conn.cursor()
    cur.execute("""
        SELECT requesterId, requestDate
        FROM FriendRequest
        WHERE requesteeId = ? AND status = 'pending'
    """, (user_id,))
    requests = [dict(row) for row in cur.fetchall()]
    conn.close()
    return requests

# respond to a friend request (accept/reject)
@router.post("/requests/respond")
def respond_to_request(req: FriendResponseIn):
    conn = get_db(); cur = conn.cursor()

    # update status
    new_status = 'accepted' if req.accept else 'rejected'
    cur.execute("""
        UPDATE FriendRequest
        SET status = ?
        WHERE requesterId = ? AND requesteeId = ? AND status = 'pending'
    """, (new_status, req.requesterId, req.requesteeId))

    if cur.rowcount == 0:
        raise HTTPException(404, "No pending request found")

    # if accepted, add to Friendship table
    if req.accept:
        userA, userB = sorted([req.requesterId, req.requesteeId])
        cur.execute("""
            INSERT INTO Friendship (userA, userB)
            VALUES (?, ?)
        """, (userA, userB))

    conn.commit()
    conn.close()
    return {"message": f"Friend request {new_status}"}

# get all friends for a user
@router.get("/list/{user_id}")
def get_friends(user_id: str):
    conn = get_db(); cur = conn.cursor()
    cur.execute("""
        SELECT CASE
                 WHEN userA = ? THEN userB
                 ELSE userA
               END AS friendId,
               friendedDate
        FROM Friendship
        WHERE userA = ? OR userB = ?
    """, (user_id, user_id, user_id))
    friends = [dict(row) for row in cur.fetchall()]
    conn.close()
    return friends

@router.delete("/remove")
def remove_friend(req: RemoveFriendRequest):
    conn = get_db()
    cur  = conn.cursor()

    if req.userId == req.friendId:
        raise HTTPException(400, "You cannot remove yourself as a friend")

    userA, userB = sorted([req.userId, req.friendId])

    cur.execute(
        "DELETE FROM Friendship WHERE userA = ? AND userB = ?",
        (userA, userB)
    )
    if cur.rowcount == 0:
        conn.close()
        raise HTTPException(404, "Friendship not found")

    cur.execute(
        """
        DELETE FROM FriendRequest
         WHERE (requesterId = ? AND requesteeId = ?)
            OR (requesterId = ? AND requesteeId = ?)
        """,
        (req.userId, req.friendId, req.friendId, req.userId)
    )

    conn.commit()
    conn.close()
    return {"message": "Friend removed successfully (and any pending requests cleared)"}
