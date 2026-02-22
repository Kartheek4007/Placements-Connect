from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base, get_db
import app.models

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Placement Management System")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from app.routers import auth, users, companies, drives, applications, files
from app.models.company import Company
from app.models.drive import Drive
from app.models.application import Application

@app.get("/stats")
def get_global_stats(db: Session = Depends(get_db)):
    return {
        "total_companies": db.query(Company).count(),
        "total_drives": db.query(Drive).count(),
        "active_drives": db.query(Drive).filter(Drive.status == "Active").count(),
        "total_applications": db.query(Application).count(),
        "placed_students": db.query(Application).filter(Application.status == "Selected").count()
    }

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(companies.router)
app.include_router(drives.router)
app.include_router(applications.router)
app.include_router(files.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Placement Management System API"}
