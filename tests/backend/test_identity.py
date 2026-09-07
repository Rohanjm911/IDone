import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def get_auth_token(email: str = "identity_user@example.com") -> str:
    user_data = {
        "full_name": "Identity Tester",
        "email": email,
        "password": "SecurePassword123!",
        "confirm_password": "SecurePassword123!"
    }
    res = client.post("/auth/register", json=user_data)
    if res.status_code == 200:
        return res.json()["access_token"]
    login_res = client.post("/auth/login", json={"email": email, "password": "SecurePassword123!"})
    return login_res.json()["access_token"]

def test_identity_lifecycle():
    token = get_auth_token()
    headers = {"Authorization": f"Bearer {token}"}

    # 1. Fetch user identity
    res = client.get("/identity", headers=headers)
    assert res.status_code == 200
    data = res.json()
    assert "did" in data
    assert data["did"].startswith("did:idone:")
    assert data["status"] == "Active"
    did = data["did"]

    # 2. Fetch DID quick info
    did_res = client.get("/identity/did", headers=headers)
    assert did_res.status_code == 200
    assert did_res.json()["did"] == did

    # 3. Resolve DID to W3C DID Document
    doc_res = client.get(f"/identity/resolve/{did}")
    assert doc_res.status_code == 200
    doc = doc_res.json()
    assert doc["id"] == did
    assert "@context" in doc
    assert len(doc["verificationMethod"]) > 0
    assert doc["verificationMethod"][0]["type"] == "Ed25519VerificationKey2020"

    # 4. Key Rotation
    rotate_res = client.post("/identity/rotate-key", headers=headers)
    assert rotate_res.status_code == 200
    rotated_data = rotate_res.json()
    assert rotated_data["verification_method"].endswith("#key-rotated")
