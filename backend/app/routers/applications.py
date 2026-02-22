from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from app.database import get_db
from app.models.application import Application, Result
from app.models.drive import DriveStage
from app.schemas import ApplicationCreate, ApplicationResponse, DriveStageCreate, DriveStageResponse, ResultCreate, ResultResponse
from app.auth import get_current_active_user, get_current_admin_user
from app.models.user import User

router = APIRouter(prefix="/applications", tags=["Applications & Stages"])

@router.post("/apply", response_model=ApplicationResponse)
def apply_to_drive(app_in: ApplicationCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    existing_app = db.query(Application).filter(
        Application.drive_id == app_in.drive_id, 
        Application.student_id == current_user.id
    ).first()
    
    if existing_app:
        raise HTTPException(status_code=400, detail="Already applied to this drive")
        
    db_app = Application(
        drive_id=app_in.drive_id,
        student_id=current_user.id,
        status=app_in.status
    )
    db.add(db_app)
    db.commit()
    db.refresh(db_app)
    return db_app

@router.get("/my-applications", response_model=List[ApplicationResponse])
def get_my_applications(db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    return db.query(Application).filter(Application.student_id == current_user.id).all()

@router.get("/drive/{drive_id}", response_model=List[ApplicationResponse])
def get_drive_applications(drive_id: UUID, db: Session = Depends(get_db), admin: User = Depends(get_current_admin_user)):
    return db.query(Application).filter(Application.drive_id == drive_id).all()

@router.put("/{app_id}/status", response_model=ApplicationResponse)
def update_application_status(app_id: UUID, new_status: str, db: Session = Depends(get_db), admin: User = Depends(get_current_admin_user)):
    db_app = db.query(Application).filter(Application.id == app_id).first()
    if not db_app:
        raise HTTPException(status_code=404, detail="Application not found")
    db_app.status = new_status
    db.commit()
    db.refresh(db_app)
    return db_app

# Drive Stages
@router.post("/stages", response_model=DriveStageResponse)
def create_stage(stage: DriveStageCreate, db: Session = Depends(get_db), admin: User = Depends(get_current_admin_user)):
    db_stage = DriveStage(**stage.model_dump())
    db.add(db_stage)
    db.commit()
    db.refresh(db_stage)
    return db_stage

@router.get("/stages/drive/{drive_id}", response_model=List[DriveStageResponse])
def get_drive_stages(drive_id: UUID, db: Session = Depends(get_db)):
    return db.query(DriveStage).filter(DriveStage.drive_id == drive_id).all()

# Results
@router.post("/results", response_model=ResultResponse)
def post_result(result: ResultCreate, db: Session = Depends(get_db), admin: User = Depends(get_current_admin_user)):
    db_result = Result(**result.model_dump())
    db.add(db_result)
    db.commit()
    db.refresh(db_result)
    return db_result

@router.get("/results/all", response_model=List[ResultResponse])
def get_all_results(db: Session = Depends(get_db)):
    return db.query(Result).all()

@router.get("/results/drive/{drive_id}", response_model=List[ResultResponse])
def get_drive_results(drive_id: UUID, db: Session = Depends(get_db)):
    return db.query(Result).filter(Result.drive_id == drive_id).all()
