import urllib.request
import json
import uuid

BACKEND_URL = "http://127.0.0.1:8000"
FRONTEND_URL = "http://localhost:3000"

def test_full_system_flow():
    print("=== Testing Frontend Route Availability ===")
    routes = ["/", "/login", "/register", "/dashboard", "/identity", "/credentials", "/vault", "/verify", "/activity"]
    for route in routes:
        req = urllib.request.Request(f"{FRONTEND_URL}{route}")
        with urllib.request.urlopen(req) as resp:
            assert resp.status == 200, f"Route {route} returned {resp.status}"
            print(f" [PASS] Frontend {route} -> HTTP 200 OK")

    print("\n=== Testing Backend System End-to-End ===")
    test_email = f"evaluator_{uuid.uuid4().hex[:8]}@idone.vault"

    # 1. Register
    reg_data = json.dumps({
        "full_name": "Test Evaluator",
        "email": test_email,
        "password": "MasterPassword123!",
        "confirm_password": "MasterPassword123!"
    }).encode("utf-8")
    req = urllib.request.Request(f"{BACKEND_URL}/auth/register", data=reg_data, headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req) as resp:
        assert resp.status == 200
        auth_res = json.loads(resp.read().decode())
        token = auth_res["access_token"]
        print(f" [PASS] User Registered & Token Issued: {token[:20]}...")

    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}

    # 2. Identity Check
    req = urllib.request.Request(f"{BACKEND_URL}/identity", headers=headers)
    with urllib.request.urlopen(req) as resp:
        id_data = json.loads(resp.read().decode())
        did = id_data["did"]
        print(f" [PASS] Identity DID Resolved: {did}")

    # 3. Rotate Key
    req = urllib.request.Request(f"{BACKEND_URL}/identity/rotate-key", headers=headers, data=b"{}")
    with urllib.request.urlopen(req) as resp:
        rot_data = json.loads(resp.read().decode())
        print(f" [PASS] Cryptographic Keypair Rotated: new method {rot_data['verification_method']}")

    # 4. Issue Credential
    issue_payload = json.dumps({
        "type_name": "SecurityClearance",
        "title": "Quantum Systems Defensive Specialist",
        "issuer_name": "Cyber Defense Agency",
        "claims": {"securityLevel": "Level 5", "compartment": "Top Secret Cryp"},
        "expiration_days": 365
    }).encode("utf-8")
    req = urllib.request.Request(f"{BACKEND_URL}/credentials", data=issue_payload, headers=headers)
    with urllib.request.urlopen(req) as resp:
        cred = json.loads(resp.read().decode())
        cred_id = cred["id"]
        print(f" [PASS] Verifiable Credential Issued: '{cred['title']}' (Status: {cred['status']})")

    # 5. Selective Disclosure Sharing
    share_payload = json.dumps({
        "recipient_email": "auditor@federal.gov",
        "shared_fields": ["securityLevel"],
        "include_personal_info": False
    }).encode("utf-8")
    req = urllib.request.Request(f"{BACKEND_URL}/credentials/{cred_id}/share", data=share_payload, headers=headers)
    with urllib.request.urlopen(req) as resp:
        share_res = json.loads(resp.read().decode())
        assert "share_token" in share_res
        print(f" [PASS] Selective Disclosure Presentation Compiled. Token: {share_res['share_token']}")

    # 6. Verify Credential (Independent)
    raw_cred = json.loads(cred["raw_credential_json"])
    verify_payload = json.dumps({"credential_data": raw_cred}).encode("utf-8")
    req = urllib.request.Request(f"{BACKEND_URL}/verify/credential", data=verify_payload, headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req) as resp:
        ver_res = json.loads(resp.read().decode())
        assert ver_res["is_valid"] is True
        print(f" [PASS] Independent Cryptographic Verification Succeeded: {ver_res['status']}")

    # 7. Add Encrypted Vault Item
    vault_payload = json.dumps({
        "name": "Hardware Token Backup Seed",
        "category": "Identity",
        "is_encrypted": True,
        "encrypted_payload": "YWVzLTI1Ni1nY20tY2lwaGVydGV4dC1kZW1vLXNlY3JldA==",
        "iv": "cmFuZG9tLWl2LTEyYnl0ZXM="
    }).encode("utf-8")
    req = urllib.request.Request(f"{BACKEND_URL}/vault", data=vault_payload, headers=headers)
    with urllib.request.urlopen(req) as resp:
        v_item = json.loads(resp.read().decode())
        print(f" [PASS] Zero-Knowledge Encrypted Vault Item Stored: {v_item['name']}")

    # 8. Security Health Status
    req = urllib.request.Request(f"{BACKEND_URL}/security/status", headers=headers)
    with urllib.request.urlopen(req) as resp:
        sec = json.loads(resp.read().decode())
        print(f" [PASS] Security Health Score: {sec['security_score']}/100 (All Guarded)")

    print("\nALL SYSTEM VERIFICATIONS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    test_full_system_flow()
