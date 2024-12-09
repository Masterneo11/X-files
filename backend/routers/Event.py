from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from typing import List
from database import get_db
import models
from models import User, Event, EventAttendance
import schemas
from fastapi import HTTPException
from sqlalchemy.orm import Session
from fastapi import HTTPException
import requests
from schemas import(
    EventCreateRequest,
    FullEventInformationRequest,
    EventBase,
    UserResponse,
    EventResponse
)

router = APIRouter()


@router.get("/Event")
async def get_All_Events_by_all_users(session: Session = Depends(get_db)) -> list[models.Event]:
    return session.exec(select(models.Event)).all() 


@router.get("/users/{user_id}/events", response_model=List[EventResponse])
async def get_user_events(user_id: int, session: Session = Depends(get_db)):
    events = (
        session.exec(
            select(Event)
            .join(EventAttendance, EventAttendance.event_id == Event.id)
            .where(EventAttendance.user_id == user_id)
        ).all()
    )

    if not events:
        raise HTTPException(status_code=404, detail="User is not attending any events")

    return events


@router.get("/users/{user_id}/events")
async def get_all_events_a_single_user_is_attending(user_id: int, session: Session = Depends(get_db)):
    # Query the Event table and join with EventAttendance to get the events the user is attending
    events = (
        session.exec(
            select(Event)
            .join(EventAttendance, EventAttendance.event_id == Event.id)
            .where(EventAttendance.user_id == user_id)
        ).all()
    )

    if not events:
        raise HTTPException(status_code=404, detail="User is not attending any events")

    return events


@router.get("/events/{event_id}/attendees", response_model=List[UserResponse])
async def get_event_attendees(event_id: int, session: Session = Depends(get_db)):
    event = session.get(models.Event, event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    query = (
        select(models.User)
        .join(models.EventAttendance, models.EventAttendance.user_id == models.User.id)
        .where(models.EventAttendance.event_id == event_id)
    )
    attendees = session.exec(query).all()
    
    # Convert to Pydantic models if needed
    return [UserResponse.from_orm(user) for user in attendees]


@router.get("/events/{event_id}", response_model=FullEventInformationRequest)
async def get_single_event_details_by_id(event_id: int, session: Session = Depends(get_db)):
    event = session.get(models.Event, event_id)  # Query the event by ID
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event  # Return the single event

#     return new_event
@router.post("/events", response_model=schemas.EventBase)
async def create_event(
    event_data: schemas.EventBase, 
    session: Session = Depends(get_db)
):
    # Step 1: Fetch the numeric user ID directly from the frontend request
    user_id = event_data.user_id  # Expecting a numeric `user_id` from the frontend

    # Step 2: Verify that the user exists in the database
    user = session.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found. Ensure the user is registered.")

    # Step 3: Create the Event instance
    new_event = models.Event.from_orm(event_data)
    session.add(new_event)
    session.commit()
    session.refresh(new_event)  # Refresh to get the new ID from the database

    return new_event

@router.post("/events/{event_id}/add_user/{user_id}")
async def add_user_to_event(event_id: int, user_id: int, session: Session = Depends(get_db)):
    # Check if the event exists
    event = session.get(models.Event, event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    # Check if the user exists
    user = session.get(models.User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Check if the user is already attending the event
    attendance_query = (
        select(models.EventAttendance)
        .where(models.EventAttendance.user_id == user_id)
        .where(models.EventAttendance.event_id == event_id)
    )
    attendance = session.exec(attendance_query).first()
    if attendance:
        raise HTTPException(status_code=400, detail="User already added to the event")
    
    # Add the user to the event
    new_attendance = models.EventAttendance(user_id=user_id, event_id=event_id)
    session.add(new_attendance)
    session.commit()
    
    return {"message": "User successfully added to event"}

@router.delete("/events/{event_id}")
def delete_a_event_anyone_can_delete(event_id: int, session: Session = Depends(get_db)):
    # Fetch the event instance by its ID
    event_instance = session.get(Event, event_id)
    
    # If the event does not exist, raise an exception
    if not event_instance:
        raise HTTPException(status_code=404, detail="Event not found")

    # Delete the event instance
    session.delete(event_instance)
    session.commit()

    return {"message": f"Event with ID {event_id} deleted successfully"}

def resolve_user_id(session: Session, user_identifier: str) -> int:
    """
    Resolve a user identifier (Auth0 ID or numeric ID) to the numeric user ID.
    Use the email field to match users in the database.
    """
    # Check if the user_identifier is a string and use email to resolve the user
    if isinstance(user_identifier, str):
        user = session.query(models.User).filter(models.User.email == user_identifier).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return user.id
    return user_identifier  # If already numeric, return as is

@router.delete("/events/{event_id}/remove_user/{user_id}")
async def remove_user_from_event(event_id: int, user_id: str, session: Session = Depends(get_db)):
    """
    Remove a user from an event. Supports email-based user resolution.
    """
    # Resolve user ID dynamically
    numeric_user_id = resolve_user_id(session, user_id)

    # Check if the event exists
    event = session.get(models.Event, event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    # Check if the user is attending the event
    attendance_query = (
        select(models.EventAttendance)
        .where(models.EventAttendance.user_id == numeric_user_id)
        .where(models.EventAttendance.event_id == event_id)
    )
    attendance = session.exec(attendance_query).first()
    if not attendance:
        raise HTTPException(status_code=400, detail="User is not attending the event")

    # Remove the user from the event
    session.delete(attendance)
    session.commit()
    
    return {"message": "User successfully removed from event"}
