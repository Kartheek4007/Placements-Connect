import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey, Float, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime

class Drive(Base):
    __tablename__ = "drives"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    company_id = Column(UUID(as_uuid=True), ForeignKey("companies.id"), nullable=False)
    role = Column(String, nullable=False)
    ctc = Column(String, nullable=True)
    location = Column(String, nullable=True)
    eligibility_cgpa = Column(Float, nullable=True)
    deadline = Column(DateTime, nullable=True)
    application_link = Column(String, nullable=True)
    jd_url = Column(String, nullable=True)
    status = Column(String, default="Active") # Active or Closed
    created_at = Column(DateTime, default=datetime.utcnow)

    company = relationship("Company", back_populates="drives")
    stages = relationship("DriveStage", back_populates="drive", cascade="all, delete-orphan")
    applications = relationship("Application", back_populates="drive", cascade="all, delete-orphan")
    results = relationship("Result", back_populates="drive", cascade="all, delete-orphan")

class DriveStage(Base):
    __tablename__ = "drive_stages"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    drive_id = Column(UUID(as_uuid=True), ForeignKey("drives.id"), nullable=False)
    stage_name = Column(String, nullable=False) # e.g. Exam, GD, Interview
    stage_date = Column(DateTime, nullable=True)
    status = Column(String, default="Upcoming") # Upcoming, Ongoing, Completed
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    drive = relationship("Drive", back_populates="stages")
