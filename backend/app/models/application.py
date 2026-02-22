import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime

class Application(Base):
    __tablename__ = "applications"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    drive_id = Column(UUID(as_uuid=True), ForeignKey("drives.id"), nullable=False)
    student_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    applied_at = Column(DateTime, default=datetime.utcnow)
    status = Column(String, default="Applied") # Applied, Shortlisted, Rejected, Selected

    __table_args__ = (UniqueConstraint('drive_id', 'student_id', name='_drive_student_uc'),)

    drive = relationship("Drive", back_populates="applications")
    student = relationship("StudentProfile", back_populates="applications")

class Result(Base):
    __tablename__ = "results"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    drive_id = Column(UUID(as_uuid=True), ForeignKey("drives.id"), nullable=False)
    file_url = Column(String, nullable=False)
    published_at = Column(DateTime, default=datetime.utcnow)

    drive = relationship("Drive", back_populates="results")
