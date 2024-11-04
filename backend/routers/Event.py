from fastapi import APIRouter, Depends
from sqlmodel import Session, select

from database import get_db
import models
from models import User, Event
import schemas
from fastapi import HTTPException
from schemas import(
    EventCreateRequest,
    FullEventInformationRequest
)

router = APIRouter()


@router.get("/Event")
async def get_Event(session: Session = Depends(get_db)) -> list[models.Event]:
    return session.exec(select(models.Event)).all() 

@router.post("/events/", response_model=schemas.EventBase)
async def create_event(
    event_data: schemas.EventBase, 
    session: Session = Depends(get_db)
):
    # Create the Event instance from the Pydantic schema data
    new_event = models.Event.from_orm(event_data)
    session.add(new_event)
    session.commit()
    session.refresh(new_event)
    return new_event


@router.get("/events/{event_id}", response_model=FullEventInformationRequest)
async def get_event_by_id(event_id: int, session: Session = Depends(get_db)):
    event = session.get(models.Event, event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event






# @router.get("/Event")
# async def get_events(session: Session = Depends(get_db)) -> list[schemas.EventOverviewResponse]:
#     statement = select(models.Event).join(models.User)  # Join with User model
#     events = session.exec(statement).all()
#     user = session.exec(statement).all()
#     return [schemas.EventOverviewResponse(event_title=event.event_title, 
#                               start_time=event.start_time,
#                               event_owner=event.user.name
#                               )
#     for event in events]



# @router.post("/Event")
# async def create_event(create_event_request: EventCreateRequest, session: Session = Depends(get_db)):
#     # Check if the user exists
#     user = session.get(models.User, create_event_request.user_id)
#     if not user:
#         raise HTTPException(status_code=404, detail="User not found")
    
#     # Create an Event object using from_orm
#     event = models.Event.from_orm(create_event_request)
    
#     # Add and commit the new event to the database
#     session.add(event)
#     session.commit()
#     session.refresh(event)
#     return event


# @router.get("/Event")
# async def get_events(session: Session = Depends(get_db)) -> list[schemas.EventOverviewResponse]:
#     statement = (
#         select(
#             models.Event.event_title,
#             models.Event.event_month,
#             models.Event.event_day,
#             models.User.name.label("event_owner")
#         )
#         .join(models.EventAttendance, models.EventAttendance.event_id == models.Event.id)
#         .join(models.User, models.EventAttendance.user_id == models.User.id)
#     )

#     events = session.exec(statement).all()

#     return [
#         schemas.EventOverviewResponse(
#             event_title=event.event_title,
#             event_month=event.event_month,
#             event_day=event.event_day,
#             start_time=event.start_time,
#             event_owner=event.event_owner  # Ensure this field is in the response schema
#         )
#         for event in events
#     ]

# @router.get("/Event")
# async def get_events(session: Session = Depends(get_db)) -> list[schemas.EventOverviewResponse]:
#     statement = select(
#         models.Event.event_title,
#         models.Event.event_month,
#         models.Event.event_day,
#         models.User.name.label("event_owner")  # Select `User.name` as `event_owner`
#     ).join(models.User)
    
#     events = session.exec(statement).all()

#     return [
#         schemas.EventOverviewResponse(
#             event_title=event.event_title,
#             event_month=event.event_month,
#             event_day=event.event_day,
#             start_time=event.start_time,
#         )
#         for event in events
#     ]

# @router.get("/Event/full-info")
# async def get_full_event_info(session: Session = Depends(get_db)) -> list[schemas.FullEventInformationRequest]:
#     statement = select(
#             models.Event.event_title,
#             models.Event.event_month,
#             models.Event.event_day,
#             models.Event.start_time,
#             models.Event.end_time,
#             models.Event.location,
#             models.Event.description,
#             models.EventAttendance.attending_users

#     )



# @router.post("/Eventsss")
# async def create_event(event_data: schemas.EventBase, event_host: int, session: Session = Depends(get_db)) -> schemas.EventBase:
#     # Fetch the user from the database
#     user = session.get(models.User, event_host)
#     if not user:
#         raise HTTPException(status_code=404, detail="User not found")

#     # Create a new Event instance from the request data
#     new_event = models.Event.from_orm(event_data)

#     # Add the event to the session and commit to generate an ID
#     session.add(new_event)
#     session.commit()
#     session.refresh(new_event)

#     # Create an EventAttendance entry to associate the user with the new event
#     attendance = models.EventAttendance(event_host=user.host, event_id=new_event.id)
#     session.add(attendance)
#     session.commit()

#     # Return the created event details
#     return schemas.EventResponse.from_orm(new_event)






