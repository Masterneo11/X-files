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

# @app.post("/users/", response_model=create_user)
# async def create_user(user_data: create_user, session: Session = Depends(get_db)):
#     existing_user = session.query(User).filter(
#         (User.email == user_data.email) | (User.username == user_data.username)
#     ).first()
#     if existing_user:
#         raise HTTPException(status_code=400, detail="Email or username already registered.")

#     hashed_password = hash_password(user_data.password)
#     new_user = User(
#         name=user_data.name,
#         email=user_data.email,
#         password=hashed_password,
#         username=user_data.username,
#         photo=user_data.photo
#     )

#     session.add(new_user)
#     session.commit()
#     session.refresh(new_user)

#     # Generate token and send verification email
#     token = generate_verification_token(new_user.email)
#     send_verification_email(new_user.email, token)

#     return new_user
