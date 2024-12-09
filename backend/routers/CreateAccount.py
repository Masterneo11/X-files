from fastapi import APIRouter, Depends
from sqlmodel import Session, select

from database import get_db
import models
from models import User, Event
import schemas
from fastapi import HTTPException
from schemas import(
    EventCreateRequest,
    FullEventInformationRequest,

)

router = APIRouter()


@router.post("/create")
async def create_account():
    # Your endpoint logic here
    return {"message": "Account created successfully"}

