from app.database import SessionLocal
from sqlalchemy import text

def patch_data():
    db = SessionLocal()
    try:
        print("Patching NULL titles in results...")
        result = db.execute(text("UPDATE results SET title = 'Selection List' WHERE title IS NULL"))
        db.commit()
        print(f"✅ Patched {result.rowcount} rows in 'results'.")
        
        print("Data patch complete.")
    finally:
        db.close()

if __name__ == "__main__":
    patch_data()
