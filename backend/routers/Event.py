from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from typing import List
from database import get_db
import models
from models import User, Event, EventAttendance
import schemas
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


# @router.get("/events/{event_id}", response_model=FullEventInformationRequest)
# async def get_event_by_id(event_id: int, session: Session = Depends(get_db)):
#     event = session.get(models.Event, event_id)
#     if not event:
#         raise HTTPException(status_code=404, detail="Event not found")
#     return event


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


# @router.get("/users/{user_id}/events", response_model=list[EventResponse])
# async def get_all_events_a_single_user_is_attending(user_id: int, session: Session = Depends(get_db)):
#     """
#     Get all events a user is attending, including additional metadata like the creator's name
#     and the number of attendees for each event.
#     """
#     # Query events joined with EventAttendance and User for the creator's name
#     query = (
#         select(
#             Event,  # Main event data
#             User.name.label("creator_name"),  # Event creator's name
#             func.count(EventAttendance.user_id).label("attendee_count")  # Count of attendees
#         )
#         .join(EventAttendance, EventAttendance.event_id == Event.id)
#         .join(User, Event.user_id == User.id)  # Join to get creator's name
#         .where(EventAttendance.user_id == user_id)
#         .group_by(Event.id, User.name)  # Group by Event and User.name for proper aggregation
#     )

#     # Execute the query and fetch results
#     result = session.exec(query).all()

#     if not result:
#         raise HTTPException(status_code=404, detail="User is not attending any events")

#     # Transform results into EventResponse schema
#     events = [
#         EventResponse(
#             id=event.id,
#             event_title=event.event_title,
#             location=event.location,
#             event_day=event.event_day,
#             event_month=event.event_month,
#             start_time=event.start_time,
#             end_time=event.end_time,
#             description=event.description,
#             max_players=event.max_players,
#             public=event.public,
#             visible_address=None,  # Adjust based on your schema logic
#             invite_only=None,  # Adjust based on your schema logic
#             latitude=event.latitude,
#             longitude=event.longitude,
#             creator=creator_name,
#             attendee_count=attendee_count,
#         )
#         for event, creator_name, attendee_count in result
#     ]

#     return events

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

@router.post("/events", response_model=schemas.EventBase)
async def create_event(
    event_data: schemas.EventBase, 
    session: Session = Depends(get_db)
):
    # Create the Event instance from the Pydantic schema data
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

# @router.delete("events/{event_id}")
# async def delete_a_event_anyone_can_delete(event_id: int, session:Session = Depends(get_db)):
#     event = session.get(models.Event, event_id)
#     session.delete(Event)
#     session.commit()
#     return 


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
    
@router.delete("/events/{event_id}/remove_user/{user_id}")
async def remove_user_from_event(event_id: int, user_id: int, session: Session = Depends(get_db)):
    # Check if the event exists
    event = session.get(models.Event, event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    # Check if the user exists
    user = session.get(models.User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Check if the user is attending the event
    attendance_query = (
        select(models.EventAttendance)
        .where(models.EventAttendance.user_id == user_id)
        .where(models.EventAttendance.event_id == event_id)
    )
    attendance = session.exec(attendance_query).first()
    if not attendance:
        raise HTTPException(status_code=400, detail="User is not attending the event")

    # Remove the user from the event
    session.delete(attendance)
    session.commit()
    
    return {"message": "User successfully removed from event"}












