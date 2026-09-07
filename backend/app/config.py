import os
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "IDone"
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    
    # Server Binding
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    # Security Secrets
    SECRET_KEY: str = "idone-super-secure-production-secret-key-entropy-change-me-32b"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours
    
    # 256-bit Hex Key for server-side AES-GCM operations
    VAULT_ENCRYPTION_MASTER_KEY: str = "94a6e3557e23b2c14589d81d24c04294b05a76e1081b7e289bfad1694f29a008"
    
    # Database
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/idone"
    DATABASE_FALLBACK_SQLITE: bool = True
    
    # CORS
    CORS_ORIGINS: str = "http://localhost:3000,http://127.0.0.1:3000"
    
    # Decentralized Identity Authority
    ISSUER_DID: str = "did:idone:issuer:foundation-core-alpha-01"
    ISSUER_NAME: str = "IDone Foundation Authority"
    
    # Blockchain Anchor Settings
    IDENTITY_REGISTRY_ADDRESS: str = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
    CREDENTIAL_STATUS_ADDRESS: str = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"

    @property
    def cors_origin_list(self) -> List[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
