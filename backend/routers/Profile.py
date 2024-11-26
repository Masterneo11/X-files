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


# @router.get("/users/{user_id}/friends", response_model=List[UserResponse])
# async def get_user_friends(user_id: int, session: Session = Depends(get_db)):
#     """
#     Retrieve a list of accepted friends for a given user.
#     """
#     friends = (
#         session.exec(
#             select(models.User)
#             .join(models.Friendship, models.User.id == models.Friendship.user_id_2)
#             .where(models.Friendship.user_id_1 == user_id, models.Friendship.friendship_status == "accepted")
#         ).all()
#     )

#     if not friends:
#         raise HTTPException(status_code=404, detail="User has no accepted friends")
    
#     return friends
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


# @router.get("/friends/requests/{user_id}", response_model=List[schemas.FriendshipRequestResponse])
# async def get_incoming_friend_requests(user_id: int, session: Session = Depends(get_db)):
#     """
#     Get all incoming friend requests for the specified user ID.
#     """
#     friend_requests = session.exec(
#         select(Friendship)
#         .where(Friendship.user_id_2 == user_id, Friendship.friendship_status == "pending")
#     ).all()

#     return friend_requests

# @router.delete("/friends/request/{target_user_id}", status_code=204)
# async def cancel_friend_request(
#     target_user_id: int,
#     session: Session = Depends(get_db),
#     current_user_id: int = Depends(get_current_user_id),  # Replace with your auth mechanism
# ):
#     """
#     Cancel a pending friend request sent by the current user.
#     """
#     friendship = session.exec(
#         select(Friendship)
#         .where(
#             (Friendship.user_id_1 == current_user_id) & (Friendship.user_id_2 == target_user_id)
#             & (Friendship.friendship_status == "pending")
#         )
#     ).first()

#     if not friendship:
#         raise HTTPException(status_code=404, detail="Friend request not found")

#     session.delete(friendship)
#     session.commit()
#     return {"detail": "Friend request canceled"}


# @router.patch("/friends/accept/{request_id}", response_model=schemas.FriendshipResponse)
# async def accept_friend_request(
#     request_id: int,
#     session: Session = Depends(get_db),
#     current_user_id: int = Depends(get_current_user_id),  # Replace with your auth mechanism
# ):
#     """
#     Accept a friend request sent to the current user.
#     """
#     friendship = session.exec(
#         select(Friendship)
#         .where(
#             (Friendship.id == request_id)
#             & (Friendship.user_id_2 == current_user_id)
#             & (Friendship.friendship_status == "pending")
#         )
#     ).first()

#     if not friendship:
#         raise HTTPException(status_code=404, detail="Friend request not found")

#     friendship.friendship_status = "accepted"
#     session.add(friendship)
#     session.commit()
#     session.refresh(friendship)
#     return friendship


# @router.get("/friends/requests/{user_id}", response_model=List[schemas.FriendshipRequestResponse])
# async def get_incoming_friend_requests(user_id: int, session: Session = Depends(get_db)):
#     """
#     Get all incoming friend requests for a user.
#     """
#     friend_requests = session.exec(
#         select(Friendship)
#         .where(Friendship.user_id_2 == user_id, Friendship.friendship_status == "pending")
#     ).all()

#     return friend_requests
