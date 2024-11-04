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
    password: str

    class Config:
        orm_mode = True

class CreateUser(BaseModel):
    name: str
    email: EmailStr
    password: str
    username: str
    photo: str | None = None 

class EventOverviewResponse(BaseModel):
    event_title: str
    event_month: str
    event_day: int
    start_time: int
    creator: str


class EventBase(BaseModel):
    id: int
    event_title: str
    location: str
    event_day: int
    event_month: str
    start_time: str
    end_time: str
    description: Optional[str] = None
    max_players: int
    public: bool
    user_id: int
    


class FullEventInformationRequest(BaseModel):
    id: int
    event_title: str
    event_month: str
    event_day: int
    start_time: str
    end_time: str
    location: Optional[str] = None
    description: str
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

# class FullEventInformationRequest(BaseModel):
#     id: int
#     event_title: str
#     start_time: str
#     end_time: str
#     date: str
#     location: Optional[str] = None
#     description: str
#     attending_players_list: list[str]