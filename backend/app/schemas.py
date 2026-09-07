import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, EmailStr, Field, field_validator, ConfigDict

# ==============================================================================
# Authentication & User Schemas
# ==============================================================================

class UserRegister(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=128)
    confirm_password: str = Field(..., min_length=8, max_length=128)

    @field_validator("confirm_password")
    @classmethod
    def passwords_match(cls, v: str, info):
        if "password" in info.data and v != info.data["password"]:
            raise ValueError("Passwords do not match")
        return v

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    email: EmailStr
    full_name: str
    is_active: bool
    created_at: datetime.datetime

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

# ==============================================================================
# Identity & DID Schemas
# ==============================================================================

class IdentityCreate(BaseModel):
    public_key_hex: Optional[str] = None
    custom_did: Optional[str] = None

class IdentityResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    did: str
    public_key_hex: str
    status: str
    verification_method: str
    blockchain_tx_hash: Optional[str] = None
    created_at: datetime.datetime

class VerificationMethod(BaseModel):
    id: str
    type: str
    controller: str
    publicKeyHex: str

class DIDDocumentResponse(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    context: List[str] = Field(..., alias="@context")
    id: str
    verificationMethod: List[VerificationMethod]
    authentication: List[str]
    assertionMethod: List[str]

# ==============================================================================
# Verifiable Credential Schemas
# ==============================================================================

class CredentialCreate(BaseModel):
    type_name: str = Field(..., json_schema_extra={"example": "UniversityCredential"})
    title: str = Field(..., json_schema_extra={"example": "Bachelor of Computer Science"})
    issuer_name: Optional[str] = "Example University"
    subject_did: Optional[str] = None
    claims: Dict[str, Any] = Field(default_factory=dict)
    expiration_days: Optional[int] = 1460  # ~4 years

class CredentialImport(BaseModel):
    raw_credential_json: str

class CredentialResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    credential_id: str
    type_name: str
    title: str
    issuer_did: str
    issuer_name: str
    subject_did: str
    issuance_date: datetime.datetime
    expiration_date: Optional[datetime.datetime] = None
    status: str
    revocation_reason: Optional[str] = None
    blockchain_hash: Optional[str] = None
    raw_credential_json: str
    created_at: datetime.datetime

class CredentialShareRequest(BaseModel):
    recipient_email: EmailStr
    shared_fields: List[str] = Field(default_factory=lambda: ["title", "issuer", "issuanceDate", "verificationProof"])
    include_personal_info: bool = False

class CredentialShareResponse(BaseModel):
    recipient_email: str
    share_token: str
    shared_payload: Dict[str, Any]
    shared_at: datetime.datetime

class CredentialRevokeRequest(BaseModel):
    reason: str = Field(..., min_length=3, max_length=255)

# ==============================================================================
# Vault Schemas
# ==============================================================================

class VaultItemCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=150)
    category: str = Field(..., json_schema_extra={"example": "Education"})
    is_encrypted: bool = True
    encrypted_payload: str
    iv: str
    auth_tag: Optional[str] = None
    metadata_json: Optional[str] = None

class VaultItemResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    category: str
    is_encrypted: bool
    encrypted_payload: str
    iv: str
    auth_tag: Optional[str] = None
    metadata_json: Optional[str] = None
    created_at: datetime.datetime
    last_accessed: datetime.datetime

# ==============================================================================
# Verification Schemas
# ==============================================================================

class VerifyCredentialRequest(BaseModel):
    credential_data: Any

class VerificationCheck(BaseModel):
    name: str
    passed: bool
    details: str

class VerifyCredentialResponse(BaseModel):
    is_valid: bool
    status: str
    issuer_name: Optional[str] = None
    issuer_did: Optional[str] = None
    holder_did: Optional[str] = None
    type_name: Optional[str] = None
    title: Optional[str] = None
    issuance_date: Optional[str] = None
    expiration_date: Optional[str] = None
    signature_valid: bool
    status_active: bool
    integrity_verified: bool
    blockchain_hash: Optional[str] = None
    checks: List[VerificationCheck]
    error_message: Optional[str] = None

# ==============================================================================
# Activity & Security Status Schemas
# ==============================================================================

class ActivityResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    action_type: str
    description: str
    metadata_json: Optional[str] = None
    timestamp: datetime.datetime

class SecurityStatusResponse(BaseModel):
    vault_encrypted: bool
    identity_active: bool
    credentials_protected: bool
    no_suspicious_activity: bool
    security_score: int
    total_credentials: int
    verified_credentials: int
    vault_items_count: int
    last_security_check: datetime.datetime
