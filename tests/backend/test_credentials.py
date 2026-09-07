import json
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def get_auth_token(email: str = "cred_user@example.com") -> str:
    user_data = {
        "full_name": "Credential Holder",
        "email": email,
        "password": "Password123!456",
        "confirm_password": "Password123!456"
    }
    res = client.post("/auth/register", json=user_data)
    if res.status_code == 200:
        return res.json()["access_token"]
    login_res = client.post("/auth/login", json={"email": email, "password": "Password123!456"})
    return login_res.json()["access_token"]

def test_credential_operations():
    token = get_auth_token()
    headers = {"Authorization": f"Bearer {token}"}

    # 1. List initial seed credentials
    list_res = client.get("/credentials", headers=headers)
    assert list_res.status_code == 200
    creds = list_res.json()
    assert len(creds) >= 1
    sample_id = creds[0]["id"]

    # 2. Issue a new credential
    new_cred_data = {
        "type_name": "GovernmentProofOfResidence",
        "title": "Verified Digital Residence Proof",
        "issuer_name": "City Trust Authority",
        "claims": {
            "city": "Neo Tokyo",
            "jurisdiction": "Kanto Region",
            "postalCode": "100-0001"
        },
        "expiration_days": 365
    }
    create_res = client.post("/credentials", json=new_cred_data, headers=headers)
    assert create_res.status_code == 200
    created = create_res.json()
    assert created["title"] == "Verified Digital Residence Proof"
    assert created["status"] == "VALID"
    cred_id = created["id"]

    # 3. Inspect specific credential
    get_res = client.get(f"/credentials/{cred_id}", headers=headers)
    assert get_res.status_code == 200
    assert get_res.json()["id"] == cred_id
    raw_vc = json.loads(get_res.json()["raw_credential_json"])
    assert "proof" in raw_vc
    assert raw_vc["proof"]["type"] == "Ed25519Signature2020"

    # 4. Selective Sharing
    share_data = {
        "recipient_email": "verifier@enterprise.com",
        "shared_fields": ["city", "jurisdiction"],
        "include_personal_info": False
    }
    share_res = client.post(f"/credentials/{cred_id}/share", json=share_data, headers=headers)
    assert share_res.status_code == 200
    share_payload = share_res.json()
    assert share_payload["recipient_email"] == "verifier@enterprise.com"
    assert "shared_payload" in share_payload

    # 5. Revoke Credential
    revoke_res = client.post(
        f"/credentials/{cred_id}/revoke",
        json={"reason": "Holder moved to another jurisdiction"},
        headers=headers
    )
    assert revoke_res.status_code == 200
    assert revoke_res.json()["status"] == "REVOKED"

    # Verify status reflects REVOKED
    updated_res = client.get(f"/credentials/{cred_id}", headers=headers)
    assert updated_res.json()["status"] == "REVOKED"
    assert updated_res.json()["revocation_reason"] == "Holder moved to another jurisdiction"
