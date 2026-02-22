from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from app.auth import get_current_active_user, get_current_admin_user
from app.database import settings
from app.models.user import User
from httpx import AsyncClient
import uuid
import os

router = APIRouter(prefix="/files", tags=["File Uploads"])

# Since installing the official Supabase python client had issues, we interact with the REST API using httpx directly
@router.post("/upload/resume")
async def upload_resume(file: UploadFile = File(...), current_user: User = Depends(get_current_active_user)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    
    file_content = await file.read()
    file_ext = file.filename.split(".")[-1]
    file_name = f"{current_user.id}_resume_{uuid.uuid4().hex}.{file_ext}"
    
    url = f"{settings.SUPABASE_URL}/storage/v1/object/resumes/{file_name}"
    headers = {
        "apikey": settings.SUPABASE_KEY,
        "Authorization": f"Bearer {settings.SUPABASE_KEY}",
        "Content-Type": file.content_type
    }
    
    async with AsyncClient() as client:
        response = await client.post(url, content=file_content, headers=headers)
        if response.status_code >= 400:
            raise HTTPException(status_code=500, detail=response.text)
            
    public_url = f"{settings.SUPABASE_URL}/storage/v1/object/public/resumes/{file_name}"
    return {"url": public_url}

@router.post("/upload/jd")
async def upload_jd(file: UploadFile = File(...), admin: User = Depends(get_current_admin_user)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
        
    file_content = await file.read()
    file_ext = file.filename.split(".")[-1]
    file_name = f"jd_{uuid.uuid4().hex}.{file_ext}"
    
    url = f"{settings.SUPABASE_URL}/storage/v1/object/job_descriptions/{file_name}"
    headers = {
        "apikey": settings.SUPABASE_KEY,
        "Authorization": f"Bearer {settings.SUPABASE_KEY}",
        "Content-Type": file.content_type
    }
    
    async with AsyncClient() as client:
        response = await client.post(url, content=file_content, headers=headers)
        if response.status_code >= 400:
            raise HTTPException(status_code=500, detail=response.text)
            
    public_url = f"{settings.SUPABASE_URL}/storage/v1/object/public/job_descriptions/{file_name}"
    return {"url": public_url}
