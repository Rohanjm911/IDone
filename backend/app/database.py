import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from app.config import settings

logger = logging.getLogger("idone.database")

Base = declarative_base()

def create_database_engine():
    """
    Attempts to initialize PostgreSQL engine.
    If unavailable or connection fails and DATABASE_FALLBACK_SQLITE is enabled,
    gracefully initializes SQLite for local development.
    """
    database_url = settings.DATABASE_URL
    
    # Try PostgreSQL first if configured
    if database_url.startswith("postgresql"):
        try:
            pg_engine = create_engine(
                database_url,
                pool_pre_ping=True,
                pool_size=10,
                max_overflow=20,
                connect_args={"connect_timeout": 3}
            )
            # Test connection
            with pg_engine.connect() as conn:
                logger.info("Successfully connected to PostgreSQL database.")
                return pg_engine
        except Exception as e:
            if settings.DATABASE_FALLBACK_SQLITE:
                logger.warning(
                    f"PostgreSQL connection failed ({e}). Falling back to local SQLite database."
                )
                sqlite_url = "sqlite:///./idone.db"
                return create_engine(
                    sqlite_url,
                    connect_args={"check_same_thread": False}
                )
            else:
                raise e
    
    # Standard SQLite setup
    return create_engine(
        database_url,
        connect_args={"check_same_thread": False} if "sqlite" in database_url else {}
    )

engine = create_database_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    """FastAPI Dependency for database sessions."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
