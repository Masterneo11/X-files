from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List
from database import get_db
import schemas
from models import Friendship, User
from schemas import FriendshipResponse
  # Import the Friendship and User models

router = APIRouter()

@router.post("/friends/request", response_model=FriendshipResponse)
async def send_friend_request(
    user_id_1: int,
    user_id_2: int,
    session: Session = Depends(get_db),
):
    """
    Send a friend request from one user to another.
    """
    if user_id_1 == user_id_2:
        raise HTTPException(
            status_code=400, detail="Users cannot send friend requests to themselves"
        )

    # Check if the target user exists
    target_user = session.execute(
        select(User).where(User.id == user_id_2)
    ).scalar_one_or_none()

    if not target_user:
        raise HTTPException(status_code=404, detail="Target user not found")

    # Check if a friendship or pending request already exists
    existing_friendship = session.execute(
        select(Friendship).where(
            (Friendship.user_id_1 == user_id_1) & (Friendship.user_id_2 == user_id_2)
            | (Friendship.user_id_1 == user_id_2) & (Friendship.user_id_2 == user_id_1)
        )
    ).scalar_one_or_none()

    if existing_friendship:
        if existing_friendship.friendship_status == "pending":
            raise HTTPException(
                status_code=400, detail="Friend request already pending"
            )
        if existing_friendship.friendship_status == "accepted":
            raise HTTPException(
                status_code=400, detail="You are already friends with this user"
            )

    # Create a new pending friendship
    new_friendship = Friendship(
        user_id_1=user_id_1,
        user_id_2=user_id_2,
        friendship_status="pending",
    )
    session.add(new_friendship)
    session.commit()
    session.refresh(new_friendship)

    return new_friendship

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
    Get all incoming friend requests for the specified user ID, including sender details.
    """
    try:
        # Perform a join between Friendship and User to get sender details
        friend_requests = session.exec(
            select(Friendship, User)
            .join(User, Friendship.user_id_1 == User.id)  # Join on sender ID
            .where(Friendship.user_id_2 == user_id, Friendship.friendship_status == "pending")
        ).all()

        # Map the results to the expected schema
        return [
            schemas.FriendshipRequestResponse(
                friendship_id=friendship.id,
                sender_id=friendship.user_id_1,
                username=user.username,
                name=user.name,
                photo=user.photo,
            )
            for friendship, user in friend_requests
        ]
    except Exception as e:
        print(f"Error fetching friend requests: {e}")
        raise HTTPException(status_code=500, detail="Error fetching friend requests")

@router.get("/friends/{user_id}", response_model=List[schemas.UserResponse])
async def get_user_friends(user_id: int, session: Session = Depends(get_db)):
    """
    Get a list of all friends for a specified user.
    """
    friendships = session.exec(
        select(Friendship)
        .where(
            (Friendship.user_id_1 == user_id) & (Friendship.friendship_status == "accepted")
            | (Friendship.user_id_2 == user_id) & (Friendship.friendship_status == "accepted")
        )
    ).all()

    if not friendships:
        return []

    friend_ids = [
        friendship.user_id_1 if friendship.user_id_2 == user_id else friendship.user_id_2
        for friendship in friendships
    ]

    friends = session.exec(
        select(User).where(User.id.in_(friend_ids))
    ).all()

    return friends