from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
import app.models
from app.routers import auth

app = FastAPI(title="Placement Management System")

app.include_router(auth.router)
from app.routers import users, companies, drives, applications, files
app.include_router(users.router)
app.include_router(companies.router)
app.include_router(drives.router)
app.include_router(applications.router)
app.include_router(files.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Placement Management System API"}
