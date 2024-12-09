from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import List
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

@router.get("/users/by-email/{email}")
def get_user_by_email(email: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    if user == None:
        raise HTTPException(status_code=404, detail=" user does not exist in my current database")
    return user
    
@router.get("/users/by-username/{username}")
def get_user_by_username(username: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == username).first()
    if user is None:
        raise HTTPException(
            status_code=404, 
            detail=f"User with username '{username}' does not exist in the database"
        )
    return user

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
