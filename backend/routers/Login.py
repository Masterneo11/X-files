from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import List
import bcrypt
from database import get_db
import models 
import schemas
from schemas import ( CreateUser)
from models import User


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




@router.get("/users/by-email/{email}")
def get_user_by_email(email: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    if user == None:
        raise HTTPException(status_code=404, detail=" user does not exist in my current database")
    return user


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
    
    
    # Create a new user instance
    new_user = models.User(
        name=user_data.name,
        email=user_data.email,
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



@router.delete("/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(user_id: int, session: Session = Depends(get_db)):
    # Check if the user exists
    user = session.query(models.User).filter(models.User.id == user_id).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Here you can add additional checks, such as ensuring that deleting this user
    # doesn't violate any foreign key constraints or affect other entities (e.g., user-related data).
    
    # Delete the user from the database
    session.delete(user)
    session.commit()

    return {"detail": "User deleted successfully"}
