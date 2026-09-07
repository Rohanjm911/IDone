import json
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.services import issue_verifiable_credential

client = TestClient(app)

def test_verify_valid_credential():
    # Issue a real, valid credential
    vc = issue_verifiable_credential(
        type_name="UniversityCredential",
        title="Master of Cyber Defense",
        subject_did="did:idone:holder_verified_123",
        claims={"grade": "A+", "honors": "Distinction"},
        issuer_name="National Cyber University"
    )

    res = client.post("/verify/credential", json={"credential_data": vc})
    assert res.status_code == 200
    data = res.json()
    assert data["is_valid"] is True
    assert data["status"] == "VALID"
    assert data["signature_valid"] is True
    assert data["status_active"] is True
    assert data["integrity_verified"] is True
    assert len(data["checks"]) >= 5

def test_verify_tampered_credential():
    # Issue a real credential and then modify a claim without re-signing
    vc = issue_verifiable_credential(
        type_name="UniversityCredential",
        title="Bachelor of Computer Science",
        subject_did="did:idone:holder_tamper_test",
        claims={"gpa": "3.20"}
    )
    # Tamper with the claims payload
    vc["credentialSubject"]["gpa"] = "4.00"

    res = client.post("/verify/credential", json={"credential_data": vc})
    assert res.status_code == 200
    data = res.json()
    assert data["is_valid"] is False
    assert data["signature_valid"] is False
    assert data["status"] == "INVALID_SIGNATURE"

def test_verify_expired_credential():
    vc = issue_verifiable_credential(
        type_name="TemporaryAccessBadge",
        title="Visitor Security Pass",
        subject_did="did:idone:visitor_99",
        claims={"building": "Headquarters"},
        expiration_days=-1  # Expired yesterday
    )

    res = client.post("/verify/credential", json={"credential_data": vc})
    assert res.status_code == 200
    data = res.json()
    assert data["is_valid"] is False
    assert data["status"] == "EXPIRED"

def test_verify_malformed_credential():
    bad_payloads = [
        "not a json string at all",
        {"missing": "all required fields"},
        {"id": "urn:uuid:123"}
    ]
    for p in bad_payloads:
        res = client.post("/verify/credential", json={"credential_data": p})
        assert res.status_code == 200
        data = res.json()
        assert data["is_valid"] is False
        assert data["status"] in ["MALFORMED", "INVALID_ISSUER"]
