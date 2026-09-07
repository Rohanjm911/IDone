import hashlib
import pytest
from app.services import compute_hash, canonicalize_json

def test_blockchain_hashing_and_anchoring():
    """
    Simulates on-chain identity and credential anchoring:
    Verifies that only cryptographic hashes are generated and no PII is included in on-chain payloads.
    """
    user_identity = {
        "did": "did:idone:z6MkuV8s7T2w9XN",
        "publicKeyHex": "1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b"
    }

    # Generate identity anchor hash (keccak / sha-256 compatible)
    identity_hash = compute_hash(user_identity["did"].encode("utf-8"))
    public_key_hash = compute_hash(bytes.fromhex(user_identity["publicKeyHex"]))

    assert len(identity_hash) == 64
    assert len(public_key_hash) == 64
    # Neither hash contains the raw string or private keys
    assert "did:idone" not in identity_hash
    assert user_identity["publicKeyHex"] not in public_key_hash

def test_credential_status_anchor_integrity():
    credential_payload = {
        "@context": ["https://www.w3.org/2018/credentials/v1"],
        "id": "urn:uuid:test-credential-001",
        "type": ["VerifiableCredential", "SecurityClearance"],
        "issuer": {"id": "did:idone:authority:sec"},
        "issuanceDate": "2026-09-07T00:00:00Z",
        "credentialSubject": {
            "id": "did:idone:user:holder1",
            "level": "Top Secret"
        }
    }

    canonical_bytes = canonicalize_json(credential_payload)
    cred_anchor_hash = compute_hash(canonical_bytes)

    assert len(cred_anchor_hash) == 64

    # Tampering test: Changing "Top Secret" to "Public" changes hash completely
    tampered = dict(credential_payload)
    tampered["credentialSubject"] = {"id": "did:idone:user:holder1", "level": "Public"}
    tampered_bytes = canonicalize_json(tampered)
    tampered_hash = compute_hash(tampered_bytes)

    assert cred_anchor_hash != tampered_hash
