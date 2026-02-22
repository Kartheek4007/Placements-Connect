from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from app.database import get_db
from app.models.drive import Drive
from app.schemas import DriveCreate, DriveResponse
from app.auth import get_current_active_user, get_current_admin_user

router = APIRouter(prefix="/drives", tags=["Drives"])

@router.get("/", response_model=List[DriveResponse])
def read_drives(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    drives = db.query(Drive).offset(skip).limit(limit).all()
    return drives

@router.post("/", response_model=DriveResponse)
def create_drive(drive: DriveCreate, db: Session = Depends(get_db), admin = Depends(get_current_admin_user)):
    db_drive = Drive(**drive.model_dump())
    db.add(db_drive)
    db.commit()
    db.refresh(db_drive)
    return db_drive

@router.get("/{drive_id}", response_model=DriveResponse)
def read_drive(drive_id: UUID, db: Session = Depends(get_db)):
    drive = db.query(Drive).filter(Drive.id == drive_id).first()
    if not drive:
        raise HTTPException(status_code=404, detail="Drive not found")
    return drive
