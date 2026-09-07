import json
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def create_user_and_get_token(email: str, name: str) -> dict:
    user_data = {
        "full_name": name,
        "email": email,
        "password": "StrongSecurity123!",
        "confirm_password": "StrongSecurity123!"
    }
    res = client.post("/auth/register", json=user_data)
    if res.status_code == 200:
        return res.json()
    login_res = client.post("/auth/login", json={"email": email, "password": "StrongSecurity123!"})
    return login_res.json()

def test_unauthorized_access_rejection():
    # Attempting to access protected endpoints without token
    protected_endpoints = [
        ("GET", "/auth/me"),
        ("GET", "/identity"),
        ("GET", "/credentials"),
        ("GET", "/vault"),
        ("GET", "/activity"),
        ("GET", "/security/status")
    ]
    for method, path in protected_endpoints:
        if method == "GET":
            res = client.get(path)
        assert res.status_code == 401, f"Failed for {path}: status {res.status_code}"

def test_forged_bearer_token():
    forged_headers = {"Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.forged.token"}
    res = client.get("/auth/me", headers=forged_headers)
    assert res.status_code == 401

def test_cross_user_isolation():
    # Register User A and User B
    user_a = create_user_and_get_token("sec_alice@example.com", "Alice Sec")
    user_b = create_user_and_get_token("sec_bob@example.com", "Bob Sec")

    headers_a = {"Authorization": f"Bearer {user_a['access_token']}"}
    headers_b = {"Authorization": f"Bearer {user_b['access_token']}"}

    # User A creates a vault item
    vault_item_data = {
        "name": "Alice Secret Ledger",
        "category": "Identity",
        "is_encrypted": True,
        "encrypted_payload": "alice_secret_ciphertext==",
        "iv": "nonce123456==",
        "metadata_json": "{}"
    }
    item_res = client.post("/vault", json=vault_item_data, headers=headers_a)
    assert item_res.status_code == 200
    item_id = item_res.json()["id"]

    # User B attempts to view Alice's vault item -> must return 404
    bob_attempt = client.get(f"/vault/{item_id}", headers=headers_b)
    assert bob_attempt.status_code == 404

    # User B attempts to delete Alice's vault item -> must return 404
    bob_del_attempt = client.delete(f"/vault/{item_id}", headers=headers_b)
    assert bob_del_attempt.status_code == 404

def test_no_private_keys_exposed():
    user = create_user_and_get_token("sec_charlie@example.com", "Charlie Sec")
    headers = {"Authorization": f"Bearer {user['access_token']}"}

    # 1. Check /identity response
    id_res = client.get("/identity", headers=headers)
    assert id_res.status_code == 200
    id_data = id_res.json()
    assert "encrypted_private_key" not in id_data
    assert "private_key" not in id_data
    assert "private_key_hex" not in id_data

    # 2. Check /credentials response
    cred_res = client.get("/credentials", headers=headers)
    assert cred_res.status_code == 200
    for cred in cred_res.json():
        cred_str = json.dumps(cred).lower()
        assert "private" not in cred_str

    # 3. Check /auth/me
    me_res = client.get("/auth/me", headers=headers)
    assert me_res.status_code == 200
    me_str = json.dumps(me_res.json()).lower()
    assert "hashed_password" not in me_str
    assert "password" not in me_str

def test_argon2id_hash_format():
    from app.security import hash_password, verify_password
    pwd = "TestArgonPassword!2026"
    h = hash_password(pwd)
    # Must start with standard $argon2id$ PHC prefix
    assert h.startswith("$argon2id$")
    assert verify_password(pwd, h) is True
    assert verify_password("WrongPassword", h) is False
