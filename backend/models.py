
from sqlmodel import SQLModel, Field, Relationship
from sqlalchemy import UniqueConstraint
from typing import List, Optional

# Association table for many-to-many relationship
class EventAttendance(SQLModel, table=True):
    user_id: int = Field(foreign_key="user.id", primary_key=True)
    event_id: int = Field(foreign_key="event.id", primary_key=True)


class ClubMembers(SQLModel, table=True):
    user_id: int = Field(foreign_key="user.id", primary_key=True)
    club_id: int = Field(foreign_key="club.id", primary_key=True)
    status: str = Field(default="pending")  # "pending", "accepted", "rejected"


class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(nullable=False, max_length=100)
    email: str = Field(nullable=False, unique=True, max_length=100)
    username: str = Field(nullable=False, unique=True)
    photo: Optional[str] = Field(default=None)

    clubs: List["Club"] = Relationship(
        back_populates="members",
        link_model=ClubMembers
    )

    created_events: List["Event"] = Relationship(back_populates="creator")
    attending_events: List["Event"] = Relationship(
        back_populates="attendees",
        link_model=EventAttendance
    )
    friendships: List["Friendship"] = Relationship(back_populates="user", sa_relationship_kwargs={"foreign_keys": "[Friendship.user_id_1]"})
    friends: List["Friendship"] = Relationship(back_populates="friend", sa_relationship_kwargs={"foreign_keys": "[Friendship.user_id_2]"})

class Event(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    event_title: str = Field(nullable=False, max_length=255)
    location: str = Field(nullable=False, max_length=255)
    event_day: str = Field(nullable=False)
    event_month: str = Field(nullable=False, max_length=20)
    start_time: str = Field(nullable=False)
    end_time: str = Field(nullable=False)
    description: Optional[str] = Field(default=None)
    max_players: Optional[int]
    public: Optional[bool] = Field(default=None)
    visible_address: Optional[str] = Field(default=None)
    invite_only: Optional[str] = Field(default=None)
    latitude: Optional[float]  
    longitude: Optional[float] 

    user_id: int = Field(foreign_key="user.id")
    creator: "User" = Relationship(back_populates="created_events")
    attendees: List[User] = Relationship(
        back_populates="attending_events",
        link_model=EventAttendance
    )


class Friendship(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    friendship_status: str
    user_id_1: int = Field(foreign_key="user.id", nullable=False)
    user_id_2: int = Field(foreign_key="user.id", nullable=False)

    user: "User" = Relationship(back_populates="friendships", sa_relationship_kwargs={"foreign_keys": "[Friendship.user_id_1]"})
    friend: "User" = Relationship(back_populates="friends", sa_relationship_kwargs={"foreign_keys": "[Friendship.user_id_2]"})
    __table_args__ = (
        UniqueConstraint("user_id_1", "user_id_2", name="uq_user_friend"),
    )

class Messages(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    sender_id: int = Field(foreign_key="user.id")
    receiver_id: int = Field(foreign_key="user.id")
    content: str
    timestamp: Optional[str] = Field(default=None)
    status: Optional[str] = Field(default="sent")  # "sent", "delivered", "read"




class Club(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(nullable=False, unique=True, max_length=100)
    description: Optional[str] = Field(default=None)
    private: bool = Field(default=True)  # Determines if the club is open to all users


    # Many-to-many relationship with users
    members: List["User"] = Relationship(
        back_populates="clubs",
        link_model=ClubMembers
    )
