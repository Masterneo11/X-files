
# from sqlmodel import SQLModel, Field, Relationship
# from datetime import date, time
# from typing import List


# class User(SQLModel, table=True):
#     id: int | None = Field(default=None, primary_key=True)  # Auto-incrementing ID (default behavior)
#     name: str = Field(nullable=False, max_length=100)
#     email: str = Field(nullable=False, unique=True, max_length=100)
#     password: str = Field(nullable=False, max_length=255)
#     username: str = Field(nullable=False, unique=True)
#     photo: str | None = Field(default=None)

#     events: List["Event"] = Relationship(back_populates="user")  # This should match the `user` property in Event


# class Event(SQLModel,table=True):
#     id: int | None = Field(default=None,primary_key=True)
#     user_id: int = Field(foreign_key="user.id")
#     event_title: str
#     location: str
#     start_time: time = Field(nullable=False)
#     end_time: time = Field(nullable=False)
#     description: str | None
#     max_players: int = Field(nullable=False)
    
#     user_id: int = Field(foreign_key="user.id")
#     user: User = Relationship(back_populates="events")  # This matches the `events` property in User











# from sqlmodel import SQLModel, Field, Relationship
# from datetime import date, time
# from typing import List, Optional


# from sqlmodel import SQLModel, Field, Relationship
# from typing import List, Optional

# # Association table for many-to-many relationship
# class EventAttendance(SQLModel, table=True):
#     user_id: int = Field(foreign_key="user.id", primary_key=True)
#     event_id: int = Field(foreign_key="event.id", primary_key=True)

# class User(SQLModel, table=True):
#     id: Optional[int] = Field(default=None, primary_key=True)
#     name: str = Field(nullable=False, max_length=100)
#     email: str = Field(nullable=False, unique=True, max_length=100)
#     password: str = Field(nullable=False, max_length=255)
#     username: str = Field(nullable=False, unique=True)
#     photo: Optional[str] = Field(default=None)

#     created_events: List["Event"] = Relationship(back_populates="creator")
#     attending_events: List["Event"] = Relationship(
#         back_populates="attendees",
#         link_model=EventAttendance
#     )

# class Event(SQLModel, table=True):
#     id: Optional[int] = Field(default=None, primary_key=True)
#     event_title: str = Field(nullable=False, max_length=255)
#     location: str = Field(nullable=False, max_length=255)
#     event_day: int = Field(nullable=False)
#     event_month: str = Field(nullable=False, max_length=20)
#     start_time: str = Field(nullable=False)
#     end_time: str = Field(nullable=False)
#     description: Optional[str] = Field(default=None)
#     max_players: int = Field(nullable=False)
#     public: bool 
#     visible_address: str
#     invite_only: str

    
#     user_id: int = Field(foreign_key="user.id")
#     event_host: User = Relationship(back_populates="created_events")
#     attendees: List[User] = Relationship(
#         back_populates="attending_events",
#         link_model=EventAttendance
#     )


# # class Groups(SQLModel, table=True):
# #     id: int

# # class GroupMembers(SQLModel, table=True):
# #     id: int

# class Friendship(SQLModel, table=True):
#     id: int 
#     Friendship_status: str
#     user_id_1: int = Field(foreign_key="user.id", nullable=False)
#     user_id_2: int = Field(foreign_key="user.id", nullable=False)

#     user: "User" = Relationship(back_populates="friendships", sa_relationship_kwargs={"foreign_keys": "[Friendship.user_id_1]"})
#     friend: "User" = Relationship(back_populates="friends", sa_relationship_kwargs={"foreign_keys": "[Friendship.user_id_2]"})
#     __table_args__ = (
#         SQLModel.UniqueConstraint("user_id_1", "user_id_2", name="uq_user_friend"),
#     )

    
# class Messages(SQLModel, table=True):
#     id: int
#     sender: str
#     reciever: str












from sqlmodel import SQLModel, Field, Relationship
from sqlalchemy import UniqueConstraint
from typing import List, Optional

# Association table for many-to-many relationship
class EventAttendance(SQLModel, table=True):
    user_id: int = Field(foreign_key="user.id", primary_key=True)
    event_id: int = Field(foreign_key="event.id", primary_key=True)



class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(nullable=False, max_length=100)
    email: str = Field(nullable=False, unique=True, max_length=100)
    password: str = Field(nullable=False, max_length=255)
    username: str = Field(nullable=False, unique=True)
    photo: Optional[str] = Field(default=None)

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
    event_day: int = Field(nullable=False)
    event_month: str = Field(nullable=False, max_length=20)
    start_time: str = Field(nullable=False)
    end_time: str = Field(nullable=False)
    description: Optional[str] = Field(default=None)
    max_players: int = Field(nullable=False)
    public: Optional[bool] = Field(default=None)
    visible_address: Optional[str] = Field(default=None)
    invite_only: Optional[str] = Field(default=None)

    user_id: int = Field(foreign_key="user.id")
    creator: "User" = Relationship(back_populates="created_events")  # Match this name with User model
    attendees: List[User] = Relationship(
        back_populates="attending_events",
        link_model=EventAttendance
    )

# class User(SQLModel, table=True):
#     id: Optional[int] = Field(default=None, primary_key=True)
#     name: str = Field(nullable=False, max_length=100)
#     email: str = Field(nullable=False, unique=True, max_length=100)
#     password: str = Field(nullable=False, max_length=255)
#     username: str = Field(nullable=False, unique=True)
#     photo: Optional[str] = Field(default=None)

#     created_events: List["Event"] = Relationship(back_populates="creator")
#     attending_events: List["Event"] = Relationship(
#         back_populates="attendees",
#         link_model=EventAttendance
#     )

# class Event(SQLModel, table=True):
#     id: Optional[int] = Field(default=None, primary_key=True)
#     event_title: str = Field(nullable=False, max_length=255)
#     location: str = Field(nullable=False, max_length=255)
#     event_day: int = Field(nullable=False)
#     event_month: str = Field(nullable=False, max_length=20)
#     start_time: str = Field(nullable=False)
#     end_time: str = Field(nullable=False)
#     description: Optional[str] = Field(default=None)
#     max_players: int = Field(nullable=False)
#     public: Optional[bool] = Field(default=True)
#     visible_address: Optional[str] = Field(default=None)
#     invite_only: Optional[str] = Field(default=None)

#     user_id: int = Field(foreign_key="user.id")
#     event_host: User = Relationship(back_populates="created_events")
#     attendees: List[User] = Relationship(
#         back_populates="attending_events",
#         link_model=EventAttendance
#     )

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
