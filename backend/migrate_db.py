from app.database import SessionLocal, engine
from sqlalchemy import text

def migrate():
    db = SessionLocal()
    try:
        print("Checking for missing columns...")
        
        # Add title to results
        try:
            db.execute(text("ALTER TABLE results ADD COLUMN title VARCHAR"))
            db.commit()
            print("Added 'title' to 'results' table.")
        except Exception as e:
            db.rollback()
            print(f"Skipped 'title' in 'results': {e}")

        # Add application_link to companies
        try:
            db.execute(text("ALTER TABLE companies ADD COLUMN application_link VARCHAR"))
            db.commit()
            print("Added 'application_link' to 'companies' table.")
        except Exception as e:
            db.rollback()
            print(f"Skipped 'application_link' in 'companies': {e}")

        # Add application_link to drives
        try:
            db.execute(text("ALTER TABLE drives ADD COLUMN application_link VARCHAR"))
            db.commit()
            print("Added 'application_link' to 'drives' table.")
        except Exception as e:
            db.rollback()
            print(f"Skipped 'application_link' in 'drives': {e}")

        print("Migration check complete.")
    finally:
        db.close()

if __name__ == "__main__":
    migrate()
