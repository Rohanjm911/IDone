import json
import uuid
import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User, Credential, Identity
from app.schemas import (
    CredentialResponse,
    CredentialCreate,
    CredentialImport,
    CredentialShareRequest,
    CredentialShareResponse,
    CredentialRevokeRequest
)
from app.security import get_current_user
from app.services import (
    issue_verifiable_credential,
    log_activity,
    canonicalize_json,
    compute_hash,
    verify_credential_payload
)

router = APIRouter(prefix="/credentials", tags=["Verifiable Credentials"])

@router.get("", response_model=List[CredentialResponse])
def get_user_credentials(
    status_filter: Optional[str] = Query(None, alias="status"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Credential).filter(Credential.user_id == current_user.id)
    if status_filter:
        query = query.filter(Credential.status == status_filter.upper())
    return query.order_by(Credential.created_at.desc()).all()

@router.get("/{credential_id}", response_model=CredentialResponse)
def get_credential_by_id(
    credential_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    cred = db.query(Credential).filter(
        Credential.id == credential_id,
        Credential.user_id == current_user.id
    ).first()
    if not cred:
        # Also try searching by URN
        cred = db.query(Credential).filter(
            Credential.credential_id == credential_id,
            Credential.user_id == current_user.id
        ).first()

    if not cred:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Credential not found."
        )
    return cred

@router.post("", response_model=CredentialResponse)
def create_or_issue_credential(
    cred_in: CredentialCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Find user identity
    identity = db.query(Identity).filter(Identity.user_id == current_user.id).first()
    subject_did = cred_in.subject_did or (identity.did if identity else f"did:idone:user:{current_user.id[:8]}")

    # Issue cryptographically signed VC
    vc = issue_verifiable_credential(
        type_name=cred_in.type_name,
        title=cred_in.title,
        subject_did=subject_did,
        claims={
            "recipientName": current_user.full_name,
            **cred_in.claims
        },
        issuer_name=cred_in.issuer_name,
        expiration_days=cred_in.expiration_days
    )

    canonical_bytes = canonicalize_json({k: v for k, v in vc.items() if k != "proof"})
    b_hash = compute_hash(canonical_bytes)

    now = datetime.datetime.now(datetime.timezone.utc)
    exp_date = now + datetime.timedelta(days=cred_in.expiration_days) if cred_in.expiration_days else None

    credential = Credential(
        user_id=current_user.id,
        credential_id=vc["id"],
        type_name=cred_in.type_name,
        title=cred_in.title,
        issuer_did=vc["issuer"]["id"],
        issuer_name=vc["issuer"]["name"],
        subject_did=subject_did,
        issuance_date=now,
        expiration_date=exp_date,
        status="VALID",
        raw_credential_json=json.dumps(vc),
        blockchain_hash=b_hash
    )
    db.add(credential)
    db.commit()
    db.refresh(credential)

    log_activity(db, current_user.id, "CREDENTIAL_ISSUED", f"Issued '{cred_in.title}' ({vc['id'][:20]}...).")
    return credential

@router.post("/import", response_model=CredentialResponse)
def import_credential(
    cred_in: CredentialImport,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Verify before importing
    verification = verify_credential_payload(db, cred_in.raw_credential_json)
    if not verification["is_valid"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot import invalid credential: {verification['error_message']}"
        )

    vc = json.loads(cred_in.raw_credential_json)
    cred_id = vc.get("id", f"urn:uuid:{uuid.uuid4()}")
    
    # Check duplicate
    existing = db.query(Credential).filter(
        Credential.user_id == current_user.id,
        Credential.credential_id == cred_id
    ).first()
    if existing:
        return existing

    identity = db.query(Identity).filter(Identity.user_id == current_user.id).first()
    subject_did = vc.get("credentialSubject", {}).get("id") or (identity.did if identity else "did:idone:holder")

    type_list = vc.get("type", ["VerifiableCredential"])
    type_name = type_list[-1] if isinstance(type_list, list) else str(type_list)
    title = vc.get("title") or vc.get("credentialSubject", {}).get("degreeOrTitle") or type_name

    now = datetime.datetime.now(datetime.timezone.utc)
    exp_date = None
    if vc.get("expirationDate"):
        try:
            exp_clean = vc["expirationDate"].replace("Z", "+00:00")
            exp_date = datetime.datetime.fromisoformat(exp_clean)
        except Exception:
            pass

    credential = Credential(
        user_id=current_user.id,
        credential_id=cred_id,
        type_name=type_name,
        title=title,
        issuer_did=verification["issuer_did"] or "did:idone:issuer:unknown",
        issuer_name=verification["issuer_name"] or "Verified Issuer",
        subject_did=subject_did,
        issuance_date=now,
        expiration_date=exp_date,
        status="VALID",
        raw_credential_json=json.dumps(vc),
        blockchain_hash=verification.get("blockchain_hash")
    )
    db.add(credential)
    db.commit()
    db.refresh(credential)

    log_activity(db, current_user.id, "CREDENTIAL_IMPORTED", f"Imported credential '{title}'.")
    return credential

@router.delete("/{credential_id}")
def delete_credential(
    credential_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    cred = db.query(Credential).filter(
        Credential.id == credential_id,
        Credential.user_id == current_user.id
    ).first()
    if not cred:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Credential not found.")

    title = cred.title
    db.delete(cred)
    db.commit()

    log_activity(db, current_user.id, "CREDENTIAL_DELETED", f"Removed '{title}' from vault.")
    return {"message": "Credential removed successfully."}

@router.post("/{credential_id}/share", response_model=CredentialShareResponse)
def share_credential_selectively(
    credential_id: str,
    share_req: CredentialShareRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    cred = db.query(Credential).filter(
        Credential.id == credential_id,
        Credential.user_id == current_user.id
    ).first()
    if not cred:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Credential not found.")

    raw_vc = json.loads(cred.raw_credential_json)
    
    # Selective disclosure construction
    shared_subject = {"id": raw_vc.get("credentialSubject", {}).get("id")}
    orig_subject = raw_vc.get("credentialSubject", {})
    
    # If user selected specific fields or personal info
    for field in share_req.shared_fields:
        if field in orig_subject:
            shared_subject[field] = orig_subject[field]

    if not share_req.include_personal_info:
        # Strip sensitive personal attributes
        for sensitive_key in ["ssn", "nationalId", "dob", "address", "phoneNumber"]:
            shared_subject.pop(sensitive_key, None)

    shared_payload = {
        "@context": raw_vc.get("@context"),
        "id": raw_vc.get("id"),
        "type": raw_vc.get("type"),
        "title": cred.title,
        "issuer": raw_vc.get("issuer"),
        "issuanceDate": raw_vc.get("issuanceDate"),
        "expirationDate": raw_vc.get("expirationDate"),
        "credentialSubject": shared_subject,
        "proof": raw_vc.get("proof")
    }

    share_token = f"idone_vp_{uuid.uuid4().hex}"
    now = datetime.datetime.now(datetime.timezone.utc)

    log_activity(
        db,
        current_user.id,
        "CREDENTIAL_SHARED",
        f"Shared '{cred.title}' with {share_req.recipient_email}."
    )

    return {
        "recipient_email": share_req.recipient_email,
        "share_token": share_token,
        "shared_payload": shared_payload,
        "shared_at": now
    }

@router.post("/{credential_id}/revoke")
def revoke_credential(
    credential_id: str,
    revoke_req: CredentialRevokeRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    cred = db.query(Credential).filter(
        Credential.id == credential_id,
        Credential.user_id == current_user.id
    ).first()
    if not cred:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Credential not found.")

    cred.status = "REVOKED"
    cred.revocation_reason = revoke_req.reason
    cred.revocation_date = datetime.datetime.now(datetime.timezone.utc)
    db.commit()

    log_activity(db, current_user.id, "CREDENTIAL_REVOKED", f"Revoked '{cred.title}' ({revoke_req.reason}).")
    return {"message": f"Credential {cred.title} has been revoked.", "status": "REVOKED"}
