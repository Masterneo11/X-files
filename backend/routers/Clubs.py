from sqlmodel import Session, select
from typing import List
from database import get_db
from fastapi import APIRouter, Depends, HTTPException

from database import get_db
from models import Club, ClubMembers, User

router = APIRouter()


@router.get("/users/{user_id}/clubs", response_model=List[Club])
def get_user_clubs(user_id: int, db: Session = Depends(get_db)):
    """
    Get all clubs a user is part of.
    """
    # Query the ClubMembers table for clubs where the user is an accepted member
    user_clubs = db.query(Club).join(ClubMembers).filter(
        ClubMembers.user_id == user_id,
        ClubMembers.status == "accepted"
    ).all()

    return user_clubs


@router.post("/clubs", response_model=Club, status_code=201)
def create_club(club: Club, db: Session = Depends(get_db)):
    """
    Creates a new club and saves it in the database.
    """
    # Check if club name is already taken
    existing_club = db.query(Club).filter(Club.name == club.name).first()
    # if existing_club:
    #     raise HTTPException(status_code=400, detail="A club with this name already exists.")

    # Add and commit the new club to the database
    db.add(club)
    db.commit()
    db.refresh(club)  # Refresh the club to return the updated object

    return club


@router.get("/clubs/{club_id}", response_model=Club)
def get_club(club_id: int, db: Session = Depends(get_db)):
    club = db.query(Club).filter(Club.id == club_id).first()
    return club


@router.delete("/clubs/{club_id}", status_code=204)
def delete_club(club_id: int, db: Session = Depends(get_db)):
    club = db.query(Club).filter(Club.id == club_id).first()
    db.delete(club)
    db.commit()
    return

@router.get("/clubs/{club_id}/members", response_model=List[User])
def get_club_members(club_id: int, db: Session = Depends(get_db)):
    """
    Fetch all members of a specific club by club ID.
    """
    # Query the club to ensure it exists
    club = db.query(Club).filter(Club.id == club_id).first()
    if not club:
        raise HTTPException(status_code=404, detail="Club not found")

    # Retrieve all users associated with the club
    club_members_query = db.query(User).join(ClubMembers).filter(ClubMembers.club_id == club_id)
    club_members = club_members_query.all()

    return club_members


@router.get("/clubs/search", response_model=List[Club])
def search_clubs(query: str, db: Session = Depends(get_db)):
    """
    Search for clubs by name or other criteria.
    """
    clubs = db.query(Club).filter(Club.name.ilike(f"%{query}%")).all()
    return clubs


@router.post("/clubs/{club_id}/join")
def request_to_join_club(club_id: int, user_id: int, db: Session = Depends(get_db)):
    """
    Send a request to join a club.
    """
    # Check if the user is already a member
    existing_membership = db.query(ClubMembers).filter(
        ClubMembers.club_id == club_id, ClubMembers.user_id == user_id
    ).first()

    if existing_membership:
        if existing_membership.status == "pending":
            raise HTTPException(status_code=400, detail="Request already pending")
        elif existing_membership.status == "accepted":
            raise HTTPException(status_code=400, detail="Already a member")

    # Create a new pending membership
    membership = ClubMembers(club_id=club_id, user_id=user_id, status="pending")
    db.add(membership)
    db.commit()
    return {"message": "Request to join sent"}


@router.patch("/clubs/{club_id}/requests/{user_id}")
def manage_join_request(
    club_id: int,
    user_id: int,
    action: str,  # "approve" or "reject"
    db: Session = Depends(get_db)
):
    """
    Approve or reject a user's join request.
    """
    membership = db.query(ClubMembers).filter(
        ClubMembers.club_id == club_id, ClubMembers.user_id == user_id
    ).first()

    if not membership or membership.status != "pending":
        raise HTTPException(status_code=404, detail="No pending request found")

    if action == "approve":
        membership.status = "accepted"
        message = "Request approved"
    elif action == "reject":
        membership.status = "rejected"
        message = "Request rejected"
    else:
        raise HTTPException(status_code=400, detail="Invalid action")

    db.commit()
    return {"message": message}


@router.post("/clubs/{club_id}/invite")
def invite_user_to_club(club_id: int, user_id: int, db: Session = Depends(get_db)):
    """
    Invite a user to join a club.
    """
    # Check if the user is already a member or has a pending invitation
    existing_invitation = db.query(ClubMembers).filter(
        ClubMembers.club_id == club_id, ClubMembers.user_id == user_id
    ).first()

    if existing_invitation:
        raise HTTPException(status_code=400, detail="User already invited or a member")

    # Create a new invitation
    invitation = ClubMembers(club_id=club_id, user_id=user_id, status="pending")
    db.add(invitation)
    db.commit()
    return {"message": "Invitation sent"}


@router.patch("/clubs/{club_id}/invitations/{user_id}")
def respond_to_invitation(
    club_id: int,
    user_id: int,
    action: str,  # "accept" or "decline"
    db: Session = Depends(get_db)
):
    """
    Respond to a club invitation.
    """
    invitation = db.query(ClubMembers).filter(
        ClubMembers.club_id == club_id, ClubMembers.user_id == user_id, ClubMembers.status == "pending"
    ).first()

    if not invitation:
        raise HTTPException(status_code=404, detail="No pending invitation found")

    if action == "accept":
        invitation.status = "accepted"
        message = "Invitation accepted"
    elif action == "decline":
        invitation.status = "rejected"
        message = "Invitation declined"
    else:
        raise HTTPException(status_code=400, detail="Invalid action")

    db.commit()
    return {"message": message}
