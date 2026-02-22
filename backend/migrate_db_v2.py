from app.database import SessionLocal
from sqlalchemy import text

def migrate():
    db = SessionLocal()
    try:
        print("Starting robust migration...")
        
        # Helper to add column safely
        def add_column(table, col, col_type):
            try:
                db.execute(text(f"ALTER TABLE {table} ADD COLUMN {col} {col_type}"))
                db.commit()
                print(f"✅ Added '{col}' to '{table}' table.")
            except Exception as e:
                db.rollback()
                if "already exists" in str(e).lower():
                    print(f"ℹ️ Column '{col}' already exists in '{table}'.")
                else:
                    print(f"❌ Error adding '{col}' to '{table}': {e}")

        add_column("results", "title", "VARCHAR")
        add_column("companies", "application_link", "VARCHAR")
        add_column("drives", "application_link", "VARCHAR")

        print("Migration complete.")
    finally:
        db.close()

if __name__ == "__main__":
    migrate()
