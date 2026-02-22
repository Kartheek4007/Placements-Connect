from pydantic import BaseModel, EmailStr
from uuid import UUID
from datetime import datetime
from typing import Optional

class UserBase(BaseModel):
    email: EmailStr
    name: str
    role: str = "student"

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: UUID
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class StudentProfileBase(BaseModel):
    reg_number: str
    department: str
    year: str
    cgpa: float
    resume_url: Optional[str] = None

class StudentProfileCreate(StudentProfileBase):
    pass

class StudentProfileResponse(StudentProfileBase):
    user_id: UUID

    class Config:
        from_attributes = True

class UserProfileResponse(UserResponse):
    profile: Optional[StudentProfileResponse] = None

class CompanyBase(BaseModel):
    name: str
    description: Optional[str] = None

class CompanyCreate(CompanyBase):
    pass

class CompanyResponse(CompanyBase):
    id: UUID
    created_at: datetime

    class Config:
        from_attributes = True

class DriveBase(BaseModel):
    role: str
    ctc: Optional[str] = None
    location: Optional[str] = None
    eligibility_cgpa: Optional[float] = None
    deadline: Optional[datetime] = None
    application_link: Optional[str] = None
    jd_url: Optional[str] = None
    status: str = "Active"

class DriveCreate(DriveBase):
    company_id: UUID

class DriveResponse(DriveBase):
    id: UUID
    company_id: UUID
    company: CompanyResponse
    created_at: datetime

    class Config:
        from_attributes = True

class DriveStageBase(BaseModel):
    stage_name: str
    stage_date: Optional[datetime] = None
    status: str = "Upcoming"
    description: Optional[str] = None

class DriveStageCreate(DriveStageBase):
    drive_id: UUID

class DriveStageResponse(DriveStageBase):
    id: UUID
    drive_id: UUID
    created_at: datetime

    class Config:
        from_attributes = True

class ApplicationBase(BaseModel):
    status: str = "Applied"

class ApplicationCreate(ApplicationBase):
    drive_id: UUID

class ApplicationResponse(ApplicationBase):
    id: UUID
    drive_id: UUID
    student_id: UUID
    applied_at: datetime
    drive: DriveResponse
    student: StudentProfileResponse

    class Config:
        from_attributes = True

class ResultBase(BaseModel):
    file_url: str

class ResultCreate(ResultBase):
    drive_id: UUID

class ResultResponse(ResultBase):
    id: UUID
    drive_id: UUID
    published_at: datetime

    class Config:
        from_attributes = True
