from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List
from database import get_db
import models
from models import User, Friendship
import schemas
from schemas import FriendshipRequest, UserResponse
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List


router = APIRouter()

@router.get("/friends")
async def get_all_users(session: Session = Depends(get_db)) -> list[User]:
    return session.exec(select(models.User)).all()


@router.get("/users/{user_id}/friends", response_model=List[UserResponse])
async def get_user_friends(user_id: int, session: Session = Depends(get_db)):
    """
    Retrieve a list of accepted friends for a given user.
    """
    friends = (
        session.exec(
            select(models.User)
            .join(models.Friendship, models.User.id == models.Friendship.user_id_2)
            .where(
                models.Friendship.user_id_1 == user_id,
                models.Friendship.friendship_status == "accepted",
            )
        ).all()
    )

    # Return an empty list instead of raising an exception
    return friends if friends else []

@router.get("/users/{user_id}")
def get_user(user_id: int, session: Session = Depends(get_db)) -> User:
    user = session.get(User, user_id)  # Fetch the user by ID
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.post("/friends/request", response_model=schemas.FriendshipResponse)
async def send_friend_request(
    request: FriendshipRequest,
    session: Session = Depends(get_db),
):
    """
    Send a friend request to another user.
    """
    # Check if the friendship already exists
    existing_friendship = session.exec(
        select(models.Friendship).where(
            (models.Friendship.user_id_1 == request.user_id_1) & (models.Friendship.user_id_2 == request.user_id_2)
            | (models.Friendship.user_id_1 == request.user_id_2) & (models.Friendship.user_id_2 == request.user_id_1)
        )
    ).first()

    if existing_friendship:
        raise HTTPException(status_code=400, detail="Friendship already exists or is pending")
    
    # Create the new friendship request
    new_friendship = models.Friendship(
        user_id_1=request.user_id_1,
        user_id_2=request.user_id_2,
        friendship_status="pending"
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



@router.delete("/users/{user_id}", status_code=204)
async def delete_user(user_id: str, session: Session = Depends(get_db)):  # Changed user_id type to str
    user = session.query(models.User).filter(models.User.id == user_id).first()  # Updated query to filter by string
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Reassign events created by the user
    SYSTEM_USER_ID = "system_user"  # Example system user ID, must match your schema
    session.query(models.Event).filter(models.Event.user_id == user_id).update(
        {"user_id": SYSTEM_USER_ID}
    )

    # Delete related data
    session.query(models.EventAttendance).filter(
        models.EventAttendance.event_id.in_(
            session.query(models.Event.id).filter(models.Event.user_id == user_id)
        )
    ).delete()

    session.query(models.Friendship).filter(
        (models.Friendship.user_id_1 == user_id) | (models.Friendship.user_id_2 == user_id)
    ).delete()

    session.query(models.Messages).filter(
        (models.Messages.sender_id == user_id) | (models.Messages.receiver_id == user_id)
    ).delete()

    session.query(models.ClubMembers).filter(models.ClubMembers.user_id == user_id).delete()

    session.delete(user)
    session.commit()

    return {"detail": f"User with ID {user_id} has been deleted."}


