import json
import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User, Identity, Credential, VaultItem
from app.schemas import UserRegister, UserLogin, UserResponse, Token
from app.security import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user,
    generate_ed25519_keypair,
    encrypt_aes_gcm
)
from app.services import (
    generate_did,
    issue_verifiable_credential,
    log_activity,
    canonicalize_json,
    compute_hash
)

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=Token)
def register(user_in: UserRegister, db: Session = Depends(get_db)):
    # 1. Check existing user
    existing_user = db.query(User).filter(User.email == user_in.email.lower()).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists."
        )

    # 2. Hash password using genuine Argon2id
    hashed_pw = hash_password(user_in.password)

    # 3. Create User account
    user = User(
        email=user_in.email.lower(),
        full_name=user_in.full_name,
        hashed_password=hashed_pw,
        is_active=True
    )
    db.add(user)
    db.flush()

    # 4. Generate Ed25519 Keypair and DID
    priv_hex, pub_hex = generate_ed25519_keypair()
    did_str = generate_did(pub_hex)

    # Server-side protect the generated private key using AES-256-GCM
    enc_priv, enc_iv = encrypt_aes_gcm(priv_hex)

    identity = Identity(
        user_id=user.id,
        did=did_str,
        public_key_hex=pub_hex,
        encrypted_private_key=f"{enc_priv}:{enc_iv}",
        status="Active",
        verification_method=f"{did_str}#key-1"
    )
    db.add(identity)

    # 5. Initialize sample seed credentials for realistic demonstration
    # Credential 1: Bachelor of Computer Science from Example University
    vc_sample_1 = issue_verifiable_credential(
        type_name="UniversityCredential",
        title="Bachelor of Computer Science",
        subject_did=did_str,
        claims={
            "recipientName": user.full_name,
            "degree": "Bachelor of Computer Science",
            "institution": "Example University",
            "gpa": "3.92",
            "honors": "Summa Cum Laude"
        },
        issuer_name="Example University"
    )
    db_cred_1 = Credential(
        user_id=user.id,
        credential_id=vc_sample_1["id"],
        type_name="UniversityCredential",
        title="Bachelor of Computer Science",
        issuer_did=vc_sample_1["issuer"]["id"],
        issuer_name=vc_sample_1["issuer"]["name"],
        subject_did=did_str,
        issuance_date=datetime.datetime.now(datetime.timezone.utc),
        expiration_date=datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(days=1460),
        status="VALID",
        raw_credential_json=json.dumps(vc_sample_1),
        blockchain_hash=compute_hash(canonicalize_json({k: v for k, v in vc_sample_1.items() if k != "proof"}))
    )
    db.add(db_cred_1)

    # Credential 2: Professional Cybersecurity Specialist
    vc_sample_2 = issue_verifiable_credential(
        type_name="ProfessionalLicense",
        title="Certified Identity & Cryptography Architect",
        subject_did=did_str,
        claims={
            "recipientName": user.full_name,
            "certification": "Certified Identity & Cryptography Architect",
            "certifyingBody": "IDone Security Consortium",
            "licenseNumber": "CICA-2026-98104"
        },
        issuer_name="IDone Security Consortium"
    )
    db_cred_2 = Credential(
        user_id=user.id,
        credential_id=vc_sample_2["id"],
        type_name="ProfessionalLicense",
        title="Certified Identity & Cryptography Architect",
        issuer_did=vc_sample_2["issuer"]["id"],
        issuer_name=vc_sample_2["issuer"]["name"],
        subject_did=did_str,
        issuance_date=datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(days=15),
        expiration_date=datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(days=730),
        status="VALID",
        raw_credential_json=json.dumps(vc_sample_2),
        blockchain_hash=compute_hash(canonicalize_json({k: v for k, v in vc_sample_2.items() if k != "proof"}))
    )
    db.add(db_cred_2)

    # 6. Initialize default encrypted vault locker item
    vault_welcome = {
        "title": "Welcome to your Encrypted Vault",
        "recoverySeedNotice": "All data inside this locker is zero-knowledge encrypted.",
        "holder": user.full_name,
        "did": did_str
    }
    enc_payload, enc_iv = encrypt_aes_gcm(json.dumps(vault_welcome))
    vault_item = VaultItem(
        user_id=user.id,
        name="Identity Recovery Record",
        category="Identity",
        is_encrypted=True,
        encrypted_payload=enc_payload,
        iv=enc_iv,
        metadata_json=json.dumps({"contentType": "application/json", "size": len(enc_payload)})
    )
    db.add(vault_item)

    # 7. Commit transaction
    db.commit()
    db.refresh(user)

    # 8. Log initial activity
    log_activity(db, user.id, "IDENTITY_CREATED", f"Decentralized Identity {did_str[:18]}... initialized.")
    log_activity(db, user.id, "VAULT_INITIALIZED", "Encrypted digital vault initialized with AES-256-GCM.")

    # 9. Issue JWT token
    access_token = create_access_token(data={"sub": user.id, "email": user.email})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

@router.post("/login", response_model=Token)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == credentials.email.lower()).first()
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This account has been deactivated."
        )

    log_activity(db, user.id, "USER_LOGIN", "Authenticated to IDone Vault session.")

    access_token = create_access_token(data={"sub": user.id, "email": user.email})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

@router.post("/logout")
def logout(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    log_activity(db, current_user.id, "USER_LOGOUT", "Terminated secure vault session.")
    return {"message": "Session terminated successfully."}

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user
