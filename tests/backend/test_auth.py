import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_register_and_login_flow():
    # 1. Register a new user
    user_data = {
        "full_name": "Alice Nakamoto",
        "email": "alice@example.com",
        "password": "StrongPassword123!",
        "confirm_password": "StrongPassword123!"
    }
    res = client.post("/auth/register", json=user_data)
    assert res.status_code == 200, res.text
    data = res.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["email"] == "alice@example.com"
    token = data["access_token"]

    # 2. Verify /auth/me with bearer token
    headers = {"Authorization": f"Bearer {token}"}
    me_res = client.get("/auth/me", headers=headers)
    assert me_res.status_code == 200
    assert me_res.json()["email"] == "alice@example.com"

    # 3. Test Login
    login_data = {
        "email": "alice@example.com",
        "password": "StrongPassword123!"
    }
    login_res = client.post("/auth/login", json=login_data)
    assert login_res.status_code == 200
    assert "access_token" in login_res.json()

    # 4. Test Login with wrong password
    bad_login = {
        "email": "alice@example.com",
        "password": "WrongPassword999!"
    }
    bad_res = client.post("/auth/login", json=bad_login)
    assert bad_res.status_code == 401

def test_register_duplicate_email():
    user_data = {
        "full_name": "Duplicate Alice",
        "email": "alice@example.com",
        "password": "AnotherPassword123!",
        "confirm_password": "AnotherPassword123!"
    }
    res = client.post("/auth/register", json=user_data)
    assert res.status_code == 400
    assert "already exists" in res.text

def test_register_password_mismatch():
    user_data = {
        "full_name": "Mismatch Bob",
        "email": "bob@example.com",
        "password": "Password123!",
        "confirm_password": "DifferentPassword456!"
    }
    res = client.post("/auth/register", json=user_data)
    assert res.status_code == 422
