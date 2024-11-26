from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from database import get_db
from models import Messages
import models
import schemas

router = APIRouter()

@router.post("/messages/", response_model=schemas.MessageResponse)
async def send_message(
    sender_id: int, 
    receiver_id: int, 
    content: str, 
    session: Session = Depends(get_db)
):
    # Check if the receiver exists
    receiver = session.query(models.User).filter(models.User.id == receiver_id).first()
    if not receiver:
        raise HTTPException(status_code=404, detail="Receiver not found")

    # Create the message
    message = models.Messages(
        sender_id=sender_id,
        receiver_id=receiver_id,
        content=content,
        timestamp=datetime.utcnow().isoformat(),  # Add a timestamp
        status="sent"
    )

    session.add(message)
    session.commit()
    session.refresh(message)

    return message



@router.get("/messages/{sender_id}/{receiver_id}", response_model=list[schemas.MessageResponse])
async def get_messages(
    sender_id: int, 
    receiver_id: int, 
    session: Session = Depends(get_db)
):
    # Retrieve messages between sender and receiver
    messages = session.query(models.Messages).filter(
        ((models.Messages.sender_id == sender_id) & (models.Messages.receiver_id == receiver_id)) |
        ((models.Messages.sender_id == receiver_id) & (models.Messages.receiver_id == sender_id))
    ).all()

    if not messages:
        raise HTTPException(status_code=404, detail="No messages found")

    return messages



@router.patch("/messages/{message_id}", response_model=schemas.MessageResponse)
async def update_message_status(
    message_id: int, 
    status: str,  # New status can be "sent", "delivered", "read"
    session: Session = Depends(get_db)
):
    # Find the message
    message = session.query(models.Messages).filter(models.Messages.id == message_id).first()

    if not message:
        raise HTTPException(status_code=404, detail="Message not found")

    # Update message status
    if status not in ["sent", "delivered", "read"]:
        raise HTTPException(status_code=400, detail="Invalid status")

    message.status = status
    session.commit()
    session.refresh(message)

    return message


@router.delete("/messages/{message_id}", status_code=204)
async def delete_message(message_id: int, session: Session = Depends(get_db)):
    # Find the message
    message = session.query(models.Messages).filter(models.Messages.id == message_id).first()

    if not message:
        raise HTTPException(status_code=404, detail="Message not found")

    # Delete the message
    session.delete(message)
    session.commit()

    return {"detail": "Message deleted successfully"}
