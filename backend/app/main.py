import logging
from contextlib import asynccontextmanager
from typing import List
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.config import settings
from app.database import engine, Base, get_db
from app.models import User, Activity
from app.schemas import ActivityResponse, SecurityStatusResponse
from app.security import get_current_user
from app.services import compute_security_status

# Routers
from app.routes.auth import router as auth_router
from app.routes.identity import router as identity_router
from app.routes.credentials import router as credentials_router
from app.routes.vault import router as vault_router
from app.routes.verify import router as verify_router

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("idone.main")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables
    logger.info("Initializing database tables...")
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables initialized successfully.")
    except Exception as e:
        logger.error(f"Error creating database tables: {e}")
    yield
    logger.info("Shutting down IDone service.")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Privacy-focused Decentralized Identity Vault & Verifiable Credential Authority",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Routers
app.include_router(auth_router)
app.include_router(identity_router)
app.include_router(credentials_router)
app.include_router(vault_router)
app.include_router(verify_router)

# Health & Root Check
@app.get("/health", tags=["System"])
def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT
    }

# Activity Timeline
@app.get("/activity", response_model=List[ActivityResponse], tags=["Dashboard"])
def get_activity_timeline(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(Activity).filter(
        Activity.user_id == current_user.id
    ).order_by(Activity.timestamp.desc()).limit(20).all()

# Security Health Status
@app.get("/security/status", response_model=SecurityStatusResponse, tags=["Dashboard"])
def get_security_status(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return compute_security_status(db, current_user)
