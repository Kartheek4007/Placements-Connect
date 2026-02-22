from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from app.database import get_db
from app.models.user import User, StudentProfile
from app.schemas import UserResponse, UserProfileResponse, StudentProfileCreate, StudentProfileResponse
from app.auth import get_current_user, get_current_active_user, get_current_admin_user

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/me", response_model=UserProfileResponse)
def read_users_me(current_user: User = Depends(get_current_active_user)):
    return current_user

@router.post("/me/profile", response_model=StudentProfileResponse)
def create_or_update_profile(
    profile_in: StudentProfileCreate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_active_user)
):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if profile:
        profile.reg_number = profile_in.reg_number
        profile.department = profile_in.department
        profile.year = profile_in.year
        profile.cgpa = profile_in.cgpa
        if profile_in.resume_url:
            profile.resume_url = profile_in.resume_url
    else:
        profile = StudentProfile(
            user_id=current_user.id,
            reg_number=profile_in.reg_number,
            department=profile_in.department,
            year=profile_in.year,
            cgpa=profile_in.cgpa,
            resume_url=profile_in.resume_url
        )
        db.add(profile)
    
    db.commit()
    db.refresh(profile)
    return profile

@router.get("/{user_id}", response_model=UserProfileResponse)
def read_user(user_id: UUID, db: Session = Depends(get_db), admin: User = Depends(get_current_admin_user)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
