from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List
from database import get_db
import schemas


router = APIRouter()

@router.delete("/friends/request/{target_user_id}", status_code=204)
async def cancel_friend_request(
    target_user_id: int,
    session: Session = Depends(get_db),
):
    """
    Cancel a pending friend request for the specified user.
    """
    friendship = session.exec(
        select(Friendship)
        .where(
            (Friendship.user_id_2 == target_user_id)
            & (Friendship.friendship_status == "pending")
        )
    ).first()

    if not friendship:
        raise HTTPException(status_code=404, detail="Friend request not found")

    session.delete(friendship)
    session.commit()
    return {"detail": "Friend request canceled"}


@router.patch("/friends/accept/{request_id}", response_model=schemas.FriendshipResponse)
async def accept_friend_request(
    request_id: int,
    session: Session = Depends(get_db),
):
    """
    Accept a friend request for the specified request ID.
    """
    friendship = session.exec(
        select(Friendship)
        .where(
            (Friendship.id == request_id)
            & (Friendship.friendship_status == "pending")
        )
    ).first()

    if not friendship:
        raise HTTPException(status_code=404, detail="Friend request not found")

    friendship.friendship_status = "accepted"
    session.add(friendship)
    session.commit()
    session.refresh(friendship)
    return friendship


@router.get("/friends/requests/{user_id}", response_model=List[schemas.FriendshipRequestResponse])
async def get_incoming_friend_requests(user_id: int, session: Session = Depends(get_db)):
    """
    Get all incoming friend requests for the specified user ID.
    """
    friend_requests = session.exec(
        select(Friendship)
        .where(Friendship.user_id_2 == user_id, Friendship.friendship_status == "pending")
    ).all()

    return friend_requests
