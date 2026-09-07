from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Verification
from app.schemas import VerifyCredentialRequest, VerifyCredentialResponse
from app.services import verify_credential_payload

router = APIRouter(prefix="/verify", tags=["Credential Verification"])

@router.post("/credential", response_model=VerifyCredentialResponse)
def verify_credential(
    request: Request,
    verify_req: VerifyCredentialRequest,
    db: Session = Depends(get_db)
):
    """
    Dedicated cryptographic verification endpoint.
    Performs RFC 8785 canonicalization, Ed25519 signature checks,
    registry revocation lookups, and SHA-256 hash checks.
    """
    result = verify_credential_payload(db, verify_req.credential_data)
    return result

@router.get("/{verification_id}")
def get_verification_record(verification_id: str, db: Session = Depends(get_db)):
    record = db.query(Verification).filter(Verification.id == verification_id).first()
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Verification record not found."
        )
    return record
