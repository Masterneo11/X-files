from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import List
import bcrypt
from database import get_db
import models 
import schemas
from schemas import ( CreateUser)

router = APIRouter()
#hi

@router.get("/User")
async def get_Users(session: Session = Depends(get_db)) -> list[models.User]:
    return session.exec(select(models.User)).all()

# @router.post("/Users")
# async def Create_User(create_user_request: models.User, session: Session = Depends(get_db)) -> models.User:
#     # Create a new User instance from the request
#     user = models.User.from_orm(create_user_request)
#     session.add(user)
#     session.commit() 
#     session.refresh(user)
#     return user






def hash_password(password: str) -> bytes:
    # Generate a salt and hash the password
    hashed_password = bcrypt.hashpw(password.encode(), bcrypt.gensalt())
    return hashed_password

@router.post("/users/", response_model=CreateUser)
async def create_user(user_data: CreateUser, session: Session = Depends(get_db)):
    # Check if the email or username already exists
    existing_user = session.query(models.User).filter(
        (models.User.email == user_data.email) | (models.User.username == user_data.username)
    ).first()
    
    if existing_user:
        raise HTTPException(status_code=400, detail="Email or username already registered.")
    
    # Hash the password
    hashed_password = hash_password(user_data.password)
    
    # Create a new user instance
    new_user = models.User(
        name=user_data.name,
        email=user_data.email,  # Use the provided email
        password=hashed_password.decode(),  # Store hashed password as string
        username=user_data.username,
        photo=user_data.photo
    )

    # Add the new user to the session and commit
    session.add(new_user)
    session.commit()
    session.refresh(new_user)

    return new_user

# @router.get("/users", response_model=List[models.User])
# async def get_users(session: Session = Depends(get_db)):
#     users = session.exec(select(models.User)).all()
#     return users

# @router.post("/users", response_model=models.User, status_code=status.HTTP_201_CREATED)
# async def create_user(create_user_request: schemas.CreateUser, session: Session = Depends(get_db)):
#     # Create a new User instance from the request data
#     user = models.User.from_orm(create_user_request)
#     # Add and commit the new user to the database
#     session.add(user)
#     session.commit()
#     session.refresh(user)
#     return user