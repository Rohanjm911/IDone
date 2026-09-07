import uuid
import datetime
from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.database import Base

def generate_uuid() -> str:
    return str(uuid.uuid4())

def utc_now() -> datetime.datetime:
    return datetime.datetime.now(datetime.timezone.utc)

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    email = Column(String(255), unique=True, index=True, nullable=False)
    full_name = Column(String(255), nullable=False)
    hashed_password = Column(String(512), nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=utc_now, nullable=False)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now, nullable=False)

    # Relationships
    identities = relationship("Identity", back_populates="user", cascade="all, delete-orphan")
    credentials = relationship("Credential", back_populates="user", cascade="all, delete-orphan")
    vault_items = relationship("VaultItem", back_populates="user", cascade="all, delete-orphan")
    activities = relationship("Activity", back_populates="user", cascade="all, delete-orphan")

class Identity(Base):
    __tablename__ = "identities"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    did = Column(String(255), unique=True, index=True, nullable=False)
    public_key_hex = Column(String(128), nullable=False)
    public_key_multibase = Column(String(128), nullable=True)
    encrypted_private_key = Column(Text, nullable=True)
    status = Column(String(32), default="Active", nullable=False)
    verification_method = Column(String(255), nullable=False)
    blockchain_tx_hash = Column(String(128), nullable=True)
    created_at = Column(DateTime, default=utc_now, nullable=False)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now, nullable=False)

    user = relationship("User", back_populates="identities")

class Credential(Base):
    __tablename__ = "credentials"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    credential_id = Column(String(255), unique=True, index=True, nullable=False)
    type_name = Column(String(128), nullable=False)
    title = Column(String(255), nullable=False)
    issuer_did = Column(String(255), nullable=False)
    issuer_name = Column(String(255), nullable=False)
    subject_did = Column(String(255), nullable=False)
    issuance_date = Column(DateTime, nullable=False)
    expiration_date = Column(DateTime, nullable=True)
    status = Column(String(32), default="VALID", nullable=False)
    revocation_reason = Column(String(255), nullable=True)
    revocation_date = Column(DateTime, nullable=True)
    raw_credential_json = Column(Text, nullable=False)
    blockchain_hash = Column(String(128), nullable=True)
    created_at = Column(DateTime, default=utc_now, nullable=False)

    user = relationship("User", back_populates="credentials")

class VaultItem(Base):
    __tablename__ = "vault_items"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    category = Column(String(64), nullable=False)
    is_encrypted = Column(Boolean, default=True, nullable=False)
    encrypted_payload = Column(Text, nullable=False)
    iv = Column(String(128), nullable=False)
    auth_tag = Column(String(128), nullable=True)
    metadata_json = Column(Text, nullable=True)
    created_at = Column(DateTime, default=utc_now, nullable=False)
    last_accessed = Column(DateTime, default=utc_now, nullable=False)

    user = relationship("User", back_populates="vault_items")

class Verification(Base):
    __tablename__ = "verifications"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    credential_id = Column(String(255), nullable=True)
    issuer_did = Column(String(255), nullable=False)
    subject_did = Column(String(255), nullable=False)
    is_valid = Column(Boolean, nullable=False)
    status = Column(String(64), nullable=False)
    checks_summary = Column(Text, nullable=False)
    verifier_ip = Column(String(64), nullable=True)
    verified_at = Column(DateTime, default=utc_now, nullable=False)

class Activity(Base):
    __tablename__ = "activities"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    action_type = Column(String(64), nullable=False)
    description = Column(String(255), nullable=False)
    metadata_json = Column(Text, nullable=True)
    timestamp = Column(DateTime, default=utc_now, nullable=False)

    user = relationship("User", back_populates="activities")
