import httpx
from app.database import settings

async def setup_storage():
    headers = {
        "apikey": settings.SUPABASE_KEY,
        "Authorization": f"Bearer {settings.SUPABASE_KEY}",
    }
    
    buckets = ["resumes", "job_descriptions", "results"]
    
    async with httpx.AsyncClient() as client:
        for bucket in buckets:
            # Try to create bucket
            print(f"Checking bucket: {bucket}")
            url = f"{settings.SUPABASE_URL}/storage/v1/bucket"
            payload = {
                "id": bucket,
                "name": bucket,
                "public": True
            }
            res = await client.post(url, json=payload, headers=headers)
            if res.status_code == 200:
                print(f"✅ Created bucket: {bucket}")
            elif res.status_code == 400 and "already exists" in res.text.lower():
                print(f"ℹ️ Bucket '{bucket}' already exists.")
            else:
                print(f"❌ Failed to setup bucket '{bucket}': {res.status_code} - {res.text}")

if __name__ == "__main__":
    import asyncio
    asyncio.run(setup_storage())
