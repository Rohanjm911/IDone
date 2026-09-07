from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User, Identity
from app.schemas import IdentityResponse, IdentityCreate, DIDDocumentResponse
from app.security import get_current_user, generate_ed25519_keypair, encrypt_aes_gcm
from app.services import generate_did, resolve_did, build_did_document, log_activity

router = APIRouter(prefix="/identity", tags=["Decentralized Identity"])

@router.get("", response_model=IdentityResponse)
def get_user_identity(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    identity = db.query(Identity).filter(Identity.user_id == current_user.id).first()
    if not identity:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No decentralized identity registered for this user."
        )
    return identity

@router.get("/did")
def get_user_did(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    identity = db.query(Identity).filter(Identity.user_id == current_user.id).first()
    if not identity:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Identity not found."
        )
    return {
        "did": identity.did,
        "status": identity.status,
        "verification_method": identity.verification_method,
        "created_at": identity.created_at
    }

@router.post("", response_model=IdentityResponse)
def create_or_link_identity(
    identity_in: IdentityCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    existing = db.query(Identity).filter(Identity.user_id == current_user.id).first()
    if existing:
        return existing

    if identity_in.public_key_hex:
        pub_hex = identity_in.public_key_hex
        did_str = identity_in.custom_did or generate_did(pub_hex)
        enc_priv = None
    else:
        priv_hex, pub_hex = generate_ed25519_keypair()
        did_str = generate_did(pub_hex)
        enc_priv_data, enc_iv = encrypt_aes_gcm(priv_hex)
        enc_priv = f"{enc_priv_data}:{enc_iv}"

    identity = Identity(
        user_id=current_user.id,
        did=did_str,
        public_key_hex=pub_hex,
        encrypted_private_key=enc_priv,
        status="Active",
        verification_method=f"{did_str}#key-1"
    )
    db.add(identity)
    db.commit()
    db.refresh(identity)

    log_activity(db, current_user.id, "IDENTITY_CREATED", f"Linked new decentralized identity {did_str}.")
    return identity

@router.post("/rotate-key", response_model=IdentityResponse)
def rotate_identity_key(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    identity = db.query(Identity).filter(Identity.user_id == current_user.id).first()
    if not identity:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Identity not found."
        )

    priv_hex, pub_hex = generate_ed25519_keypair()
    enc_priv_data, enc_iv = encrypt_aes_gcm(priv_hex)

    identity.public_key_hex = pub_hex
    identity.encrypted_private_key = f"{enc_priv_data}:{enc_iv}"
    identity.verification_method = f"{identity.did}#key-rotated"
    db.commit()
    db.refresh(identity)

    log_activity(db, current_user.id, "KEY_ROTATED", f"Rotated cryptographic key for {identity.did}.")
    return identity

@router.get("/resolve/{did:path}", response_model=DIDDocumentResponse)
def resolve_did_endpoint(did: str, db: Session = Depends(get_db)):
    """Public W3C DID Resolution Endpoint."""
    doc = resolve_did(db, did)
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"DID '{did}' could not be resolved on this network."
        )
    return doc
