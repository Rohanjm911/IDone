import os
import json
import base64
import datetime
from typing import Optional, Tuple
import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from cryptography.hazmat.primitives.kdf.argon2 import Argon2id
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from cryptography.hazmat.primitives.asymmetric import ed25519
from cryptography.exceptions import InvalidSignature

from app.config import settings
from app.database import get_db

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# ==============================================================================
# Password Hashing & Verification (Argon2id)
# ==============================================================================

def hash_password(password: str) -> str:
    """Derives a standard PHC-formatted Argon2id hash with cryptographically secure salt."""
    salt = os.urandom(16)
    kdf = Argon2id(salt=salt, length=32, iterations=2, lanes=1, memory_cost=65536)
    return kdf.derive_phc_encoded(password.encode("utf-8"))

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifies a plain password against an Argon2id PHC encoded hash."""
    try:
        Argon2id.verify_phc_encoded(plain_password.encode("utf-8"), hashed_password)
        return True
    except Exception:
        return False

# ==============================================================================
# Symmetric Encryption (AES-256-GCM)
# ==============================================================================

def get_server_master_key(key_hex: Optional[str] = None) -> bytes:
    """Returns 32-byte binary key from hex string or settings."""
    hex_str = key_hex or settings.VAULT_ENCRYPTION_MASTER_KEY
    try:
        raw_key = bytes.fromhex(hex_str)
        if len(raw_key) == 32:
            return raw_key
    except Exception:
        pass
    # Fallback to deterministic 32-byte key derived from secret
    from hashlib import sha256
    return sha256((hex_str or "idone-vault-key").encode()).digest()

def encrypt_aes_gcm(plaintext: str, key_bytes: Optional[bytes] = None) -> Tuple[str, str]:
    """
    Encrypts plaintext with AES-256-GCM.
    Returns (ciphertext_b64, nonce_b64).
    """
    key = key_bytes or get_server_master_key()
    aesgcm = AESGCM(key)
    nonce = os.urandom(12)  # Standard 96-bit nonce for GCM
    ciphertext = aesgcm.encrypt(nonce, plaintext.encode("utf-8"), None)
    return (
        base64.b64encode(ciphertext).decode("utf-8"),
        base64.b64encode(nonce).decode("utf-8")
    )

def decrypt_aes_gcm(ciphertext_b64: str, nonce_b64: str, key_bytes: Optional[bytes] = None) -> str:
    """
    Decrypts ciphertext with AES-256-GCM.
    """
    key = key_bytes or get_server_master_key()
    aesgcm = AESGCM(key)
    nonce = base64.b64decode(nonce_b64)
    ciphertext = base64.b64decode(ciphertext_b64)
    decrypted_bytes = aesgcm.decrypt(nonce, ciphertext, None)
    return decrypted_bytes.decode("utf-8")

# ==============================================================================
# Asymmetric Digital Signatures (Ed25519)
# ==============================================================================

def generate_ed25519_keypair() -> Tuple[str, str]:
    """Generates an Ed25519 key pair, returning (private_key_hex, public_key_hex)."""
    private_key = ed25519.Ed25519PrivateKey.generate()
    public_key = private_key.public_key()
    
    priv_bytes = private_key.private_bytes_raw()
    pub_bytes = public_key.public_bytes_raw()
    
    return priv_bytes.hex(), pub_bytes.hex()

def sign_ed25519(message_bytes: bytes, private_key_hex: str) -> str:
    """Signs message bytes with Ed25519 private key. Returns base64 signature."""
    priv_bytes = bytes.fromhex(private_key_hex)
    private_key = ed25519.Ed25519PrivateKey.from_private_bytes(priv_bytes)
    signature = private_key.sign(message_bytes)
    return base64.b64encode(signature).decode("utf-8")

def verify_ed25519(message_bytes: bytes, signature_b64: str, public_key_hex: str) -> bool:
    """Verifies Ed25519 signature against message bytes and public key hex."""
    try:
        pub_bytes = bytes.fromhex(public_key_hex)
        public_key = ed25519.Ed25519PublicKey.from_public_bytes(pub_bytes)
        sig_bytes = base64.b64decode(signature_b64)
        public_key.verify(sig_bytes, message_bytes)
        return True
    except (InvalidSignature, ValueError, Exception):
        return False

# ==============================================================================
# JWT Authentication Tokens
# ==============================================================================

def create_access_token(data: dict, expires_delta: Optional[datetime.timedelta] = None) -> str:
    to_encode = data.copy()
    now = datetime.datetime.now(datetime.timezone.utc)
    if expires_delta:
        expire = now + expires_delta
    else:
        expire = now + datetime.timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire, "iat": now})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def decode_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials or token expired",
            headers={"WWW-Authenticate": "Bearer"},
        )

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    from app.models import User
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    payload = decode_token(token)
    user_id: str = payload.get("sub")
    if user_id is None:
        raise credentials_exception
    user = db.query(User).filter(User.id == user_id).first()
    if user is None or not user.is_active:
        raise credentials_exception
    return user
