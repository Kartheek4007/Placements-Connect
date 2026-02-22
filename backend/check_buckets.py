import httpx
from app.database import settings

async def check_buckets():
    url = f"{settings.SUPABASE_URL}/storage/v1/bucket"
    headers = {
        "apikey": settings.SUPABASE_KEY,
        "Authorization": f"Bearer {settings.SUPABASE_KEY}",
    }
    
    async with httpx.AsyncClient() as client:
        response = await client.get(url, headers=headers)
        if response.status_code == 200:
            buckets = response.json()
            print("Existing Buckets:")
            for b in buckets:
                print(f"- {b['id']} (Public: {b['public']})")
        else:
            print(f"Failed to fetch buckets: {response.status_code} - {response.text}")

if __name__ == "__main__":
    import asyncio
    asyncio.run(check_buckets())
