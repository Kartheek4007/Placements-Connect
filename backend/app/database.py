from sqlalchemy import create_engine, URL
from sqlalchemy.orm import declarative_base, sessionmaker
from pydantic_settings import BaseSettings, SettingsConfigDict

import urllib.parse

class Settings(BaseSettings):
    DATABASE_URL: str | None = None
    DB_USER: str = "postgres.hdsrdqgvvqjmsqkdhyvu"
    DB_PASSWORD: str = ""
    DB_HOST: str = "aws-1-ap-southeast-2.pooler.supabase.com"
    DB_PORT: str = "6543"
    MIGRATION_PORT: str = "5432"
    DB_NAME: str = "postgres"
    SUPABASE_URL: str
    SUPABASE_KEY: str
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440

    model_config = SettingsConfigDict(env_file=".env")

settings = Settings()

if settings.DATABASE_URL:
    # Use direct URL if provided (standard for cloud platforms like Render)
    DATABASE_URL = settings.DATABASE_URL
    # Ensure it uses postgresql+psycopg2 driver if it's a bare postgres:// or postgresql://
    if DATABASE_URL.startswith("postgres://"):
        DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql+psycopg2://", 1)
    elif DATABASE_URL.startswith("postgresql://"):
        DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+psycopg2://", 1)
    MIGRATION_DATABASE_URL = DATABASE_URL
else:
    # Build URL from components (standard for local/legacy setup)
    DATABASE_URL = URL.create(
        drivername="postgresql+psycopg2",
        username=settings.DB_USER,
        password=settings.DB_PASSWORD,
        host=settings.DB_HOST,
        port=int(settings.DB_PORT),
        database=settings.DB_NAME
    )
    MIGRATION_DATABASE_URL = URL.create(
        drivername="postgresql+psycopg2",
        username=settings.DB_USER,
        password=settings.DB_PASSWORD,
        host=settings.DB_HOST,
        port=int(settings.MIGRATION_PORT),
        database=settings.DB_NAME
    )

engine = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
