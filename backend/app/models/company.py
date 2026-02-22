import uuid
from sqlalchemy import Column, String, DateTime, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime

class Company(Base):
    __tablename__ = "companies"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, index=True, nullable=False)
    description = Column(Text, nullable=True)
    application_link = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    drives = relationship("Drive", back_populates="company", cascade="all, delete-orphan")
