from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import time
#hi

class User(BaseModel):
    id: int
    name: str
    email: str
    username: str
    photo: Optional[str] = None

    class Config:
        orm_mode = True

class CreateUser(BaseModel):
    name: str
    username: str
    email: str
    photo: str | None = None 

class EventOverviewResponse(BaseModel):
    event_title: str
    event_month: str
    event_day: str
    start_time: int
    creator: str
    longitutde: float
    latitude: float


class EventBase(BaseModel):
    event_title: str
    location: str
    event_day: str
    event_month: str
    start_time: str
    end_time: str
    description: Optional[str] = None
    max_players: int
    public: Optional[bool] = None
    user_id: int | str
    longitude: Optional[float] = None
    latitude: Optional[float] = None



class UserResponse(BaseModel):
    id: int
    name: str
    username: str

    class Config:
        from_attributes = True


# class UserResponse(BaseModel):
#     id: int
#     name: str
#     email: str
#     photo: Optional[str] = None
    
#     class Config:
#         from_attributes = True  # Allows Pydantic to use ORM objects
    


class EventResponse(BaseModel):
    id: int
    event_title: str
    location: str
    event_day: str
    event_month: str
    start_time: str
    end_time: str
    description: Optional[str]
    max_players: Optional[int]
    public: Optional[bool]
    visible_address: Optional[str]
    invite_only: Optional[str]
    latitude: Optional[float]  # Optional because it might not be present in some events
    longitude: Optional[float]

    creator: Optional[UserResponse]  # Nested model
    class Config:
            orm_mode = True
    
class FindMapEvents(BaseModel):
    id: int
    event_title: str
    location: str
    event_day: str
    event_month: str
    start_time: str
    end_time: str
    description: Optional[str] = None
    max_players: int
    public: bool
    user_id: int 
    longitutde: float
    lattitude: float

class FullEventInformationRequest(BaseModel):
    id: int
    event_title: str
    event_month: str
    event_day: str
    start_time: str
    end_time: str
    location: Optional[str] = None
    description: Optional[str]
    longitude: Optional[float]
    latitude: Optional[float]
    user_id: int | str
    
    creator: Optional[UserResponse]  # Nested model
    attending_users_list: list[str] = []  # List of attendee names or usernames

    class Config:
        orm_mode = True

class EventCreateRequest(EventBase):
    user_id: int

class EventRead(EventBase):
    id: int
    user_id: int

    class Config:
        orm_mode = True

class FriendshipRequest(BaseModel):
    user_id_1: int
    user_id_2: int

# class FriendshipRequestResponse(BaseModel):
#     id: int
#     user_id_1: int
#     user_id_2: int
#     friendship_status: str

#     class Config:
#         orm_mode = True


class FriendshipRequestResponse(BaseModel):
    friendship_id: int
    sender_id: int
    username: str
    name: str
    photo: Optional[str]

    class Config:
        orm_mode = True

class FriendshipResponse(BaseModel):
    id: int
    user_id_1: int
    user_id_2: int
    friendship_status: str

    class Config:
        orm_mode = True

class MessageResponse(BaseModel):
    id: int
    sender_id: int
    receiver_id: int
    content: str
    timestamp: Optional[str]
    status: str

    class Config:
        orm_mode = True


# Request schema for leaving an event
class RemoveUserRequest(BaseModel):
    event_id: int  # ID of the event
    auth0_user_id: str  # Auth0 user ID

# Response schema for leaving an event
class RemoveUserResponse(BaseModel):
    message: str  # Success message
    event_id: int  # Event ID
    removed_user_id: str  # The ID









class FriendshipBase(BaseModel):
    """
    Base schema for Friendship, shared properties.
    """
    friendship_status: str
    user_id_1: int
    user_id_2: int


class FriendshipCreate(FriendshipBase):
    """
    Schema for creating a new Friendship (request body).
    """
    pass


class FriendshipResponse(FriendshipBase):
    """
    Response schema for a Friendship, including optional metadata.
    """
    id: int  # ID of the friendship in the database

    class Config:
        orm_mode = True


class FriendshipRequestResponse(BaseModel):
    """
    Schema for incoming friend request responses.
    """
    friendship_id: int  # ID of the friendship entry
    sender_id: int  # ID of the sender (user_id_1)
    username: str  # Sender's username
    name: str  # Sender's full name
    photo: Optional[str]  # Sender's profile photo URL

    class Config:
        orm_mode = True


class UserResponse(BaseModel):
    """
    Simplified response schema for user details.
    """
    id: int
    name: str
    username: str
    email: str
    photo: Optional[str] = None

    class Config:
        orm_mode = True


class FriendRequest(BaseModel):
    user_id_1: int
    user_id_2: int