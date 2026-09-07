import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def get_auth_token(email: str = "vault_user@example.com") -> str:
    user_data = {
        "full_name": "Vault Guardian",
        "email": email,
        "password": "VaultMasterPassword1!",
        "confirm_password": "VaultMasterPassword1!"
    }
    res = client.post("/auth/register", json=user_data)
    if res.status_code == 200:
        return res.json()["access_token"]
    login_res = client.post("/auth/login", json={"email": email, "password": "VaultMasterPassword1!"})
    return login_res.json()["access_token"]

def test_vault_operations():
    token = get_auth_token()
    headers = {"Authorization": f"Bearer {token}"}

    # 1. List initial vault items
    list_res = client.get("/vault", headers=headers)
    assert list_res.status_code == 200
    items = list_res.json()
    assert len(items) >= 1
    assert items[0]["is_encrypted"] is True

    # 2. Add an encrypted vault item
    new_vault_item = {
        "name": "Medical Records Passcode",
        "category": "Documents",
        "is_encrypted": True,
        "encrypted_payload": "a82f0bc38e91d84a7b==",
        "iv": "9d8174f82631a0e1==",
        "metadata_json": '{"type": "secure_note"}'
    }
    add_res = client.post("/vault", json=new_vault_item, headers=headers)
    assert add_res.status_code == 200
    created_item = add_res.json()
    assert created_item["name"] == "Medical Records Passcode"
    assert created_item["category"] == "Documents"
    item_id = created_item["id"]

    # 3. Fetch single item
    fetch_res = client.get(f"/vault/{item_id}", headers=headers)
    assert fetch_res.status_code == 200
    assert fetch_res.json()["id"] == item_id

    # 4. Filter by category
    filter_res = client.get("/vault?category=Documents", headers=headers)
    assert filter_res.status_code == 200
    doc_items = filter_res.json()
    assert all(it["category"] == "Documents" for it in doc_items)

    # 5. Delete vault item
    del_res = client.delete(f"/vault/{item_id}", headers=headers)
    assert del_res.status_code == 200
    assert "deleted successfully" in del_res.json()["message"]
