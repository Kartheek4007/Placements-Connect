import httpx
from app.database import settings
import uuid

async def test_upload():
    headers = {
        "apikey": settings.SUPABASE_KEY,
        "Authorization": f"Bearer {settings.SUPABASE_KEY}",
        "Content-Type": "text/plain"
    }
    
    file_name = f"test_{uuid.uuid4().hex}.txt"
    url = f"{settings.SUPABASE_URL}/storage/v1/object/results/{file_name}"
    
    async with httpx.AsyncClient() as client:
        res = await client.post(url, content="test content", headers=headers)
        if res.status_code == 200:
            print(f"✅ Upload success: {file_name}")
            print(f"URL: {settings.SUPABASE_URL}/storage/v1/object/public/results/{file_name}")
        else:
            print(f"❌ Upload failed: {res.status_code} - {res.text}")

if __name__ == "__main__":
    import asyncio
    asyncio.run(test_upload())
