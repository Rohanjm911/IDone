# IDone — Decentralized Identity Vault
## How to Run the Project Guide

This guide covers all the methods to launch, manage, test, and shut down the **IDone Decentralized Identity Vault** application on your machine.

---

## 📋 Prerequisites

| Tool | Recommended Version | Verify Command | Download Link |
| :--- | :--- | :--- | :--- |
| **Python** | `3.10`, `3.11`, or `3.12+` | `python --version` | [python.org](https://www.python.org/) |
| **Node.js** | `18.x` or `20.x+` (LTS) | `node --version` | [nodejs.org](https://nodejs.org/) |
| **npm** | `9.x` or `10.x+` | `npm --version` | Bundled with Node.js |

> [!NOTE]
> **Zero-Config Database**: By default, IDone automatically uses a local SQLite database (`backend/idone.db`). You do **not** need to install or configure PostgreSQL to run the project.

---

## 🚀 Method 1: One-Click Launch (Windows — Recommended)

The fastest and most convenient way to run the entire project is via the automated launcher script.

1. Open File Explorer and navigate to the project directory:
   ```plaintext
   d:\projects and certificates\projects\cyber\IDone
   ```
2. Double-click:
   ```plaintext
   launch.bat
   ```

### What `launch.bat` Does Automatically:
- ✔ Validates that Python and Node.js are installed.
- ✔ Generates a `.env` configuration file from `.env.example` if missing.
- ✔ Checks and installs missing Python and Node dependencies automatically.
- ✔ Identifies and cleans up any lingering port conflicts on ports `8000` and `3000`.
- ✔ Starts the **FastAPI Backend** on [http://127.0.0.1:8000](http://127.0.0.1:8000).
- ✔ Starts the **Next.js Web Vault** on [http://localhost:3000](http://localhost:3000).
- ✔ Automatically opens your default web browser to the IDone Web Vault.
- ✔ Provides an interactive console menu with single-key controls:
  - `[B]` — Open IDone Web Vault in default browser
  - `[D]` — Open interactive Swagger API documentation (`/docs`)
  - `[R]` — Restart both backend and frontend servers
  - `[S]` — Stop all services cleanly and exit
  - `[X]` — Keep services running in background and close the console

---

## 🛑 Method 2: One-Click Shutdown (Windows)

To cleanly stop all IDone background services and free ports `8000` and `3000`:

1. Open File Explorer in the project root.
2. Double-click:
   ```plaintext
   stop.bat
   ```

---

## 💻 Method 3: Manual Launch (Windows / PowerShell / CMD)

If you prefer launching each service manually in separate terminal windows:

### Terminal 1: FastAPI Backend
```powershell
# 1. Navigate to the backend directory
cd "d:\projects and certificates\projects\cyber\IDone\backend"

# 2. (Optional) Activate your virtual environment if you use one
.\venv\Scripts\activate

# 3. Install dependencies (first time only)
pip install -r requirements.txt

# 4. Start the FastAPI server
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

- **Backend Base URL**: [http://127.0.0.1:8000](http://127.0.0.1:8000)
- **Interactive Swagger Docs**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **OpenAPI JSON**: [http://127.0.0.1:8000/openapi.json](http://127.0.0.1:8000/openapi.json)

---

### Terminal 2: Next.js Frontend
```powershell
# 1. Navigate to the frontend directory
cd "d:\projects and certificates\projects\cyber\IDone\frontend"

# 2. Install dependencies (first time only)
npm install

# 3. Start the Next.js development server
npm run dev
```

- **Web Vault UI**: [http://localhost:3000](http://localhost:3000)

---

## 🐧 Method 4: Manual Launch (macOS / Linux)

### Terminal 1: Backend
```bash
cd IDone/backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

### Terminal 2: Frontend
```bash
cd IDone/frontend
npm install
npm run dev
```

Open your browser at **`http://localhost:3000`**.

---

## 🧭 Application Routes Reference

| Page / Feature | URL | Description |
| :--- | :--- | :--- |
| **Landing Page** | [http://localhost:3000/](http://localhost:3000/) | Live cryptographic verification preview card & architecture overview. |
| **Registration** | [http://localhost:3000/register](http://localhost:3000/register) | Generates a 12-word master recovery seed and derives an Ed25519 DID. |
| **Login** | [http://localhost:3000/login](http://localhost:3000/login) | Authenticates with Argon2id password verification and issues a JWT token. |
| **Command Center** | [http://localhost:3000/dashboard](http://localhost:3000/dashboard) | 100/100 Security Health Radar and real-time telemetry metrics. |
| **DID Identity Hub** | [http://localhost:3000/identity](http://localhost:3000/identity) | View resolved W3C JSON-LD DID Document and test cryptographic key rotation. |
| **Credentials Hub** | [http://localhost:3000/credentials](http://localhost:3000/credentials) | Issue verifiable credentials, import JSON-LD, revoke, and use Selective Disclosure. |
| **Encrypted Vault** | [http://localhost:3000/vault](http://localhost:3000/vault) | Zero-Knowledge AES-256-GCM encrypted locker with client-side decryption. |
| **Public Verifier** | [http://localhost:3000/verify](http://localhost:3000/verify) | 6-point cryptographic verification checklist against tamper resistance. |
| **Audit Trail** | [http://localhost:3000/activity](http://localhost:3000/activity) | Chronological security activity log of credential lifecycle events. |

### 🌗 Dark & Light Mode Toggle
- Located on the top navigation bar of every page (Sun / Moon icon).
- Features a **Pure Black + Dark Grey** palette (strictly zero blue tint) and high-contrast typography.
- State is preserved persistently in browser `localStorage`.

---

## 🧪 Running the Automated Test Suite

IDone includes 18 automated unit, security, blockchain, and end-to-end integration tests.

```powershell
# From the project root:
cd "d:\projects and certificates\projects\cyber\IDone"

# Set PYTHONPATH and run all tests with pytest:
$env:PYTHONPATH="backend"; python -m pytest tests -v
```

### Verified Test Breakdown (18/18 Passing):
1. `tests/backend/test_auth.py::test_register_and_login_flow`
2. `tests/backend/test_auth.py::test_register_duplicate_email`
3. `tests/backend/test_auth.py::test_register_password_mismatch`
4. `tests/backend/test_credentials.py::test_credential_operations`
5. `tests/backend/test_identity.py::test_identity_lifecycle`
6. `tests/backend/test_vault.py::test_vault_operations`
7. `tests/backend/test_verify.py::test_verify_valid_credential`
8. `tests/backend/test_verify.py::test_verify_tampered_credential`
9. `tests/backend/test_verify.py::test_verify_expired_credential`
10. `tests/backend/test_verify.py::test_verify_malformed_credential`
11. `tests/blockchain/test_contracts.py::test_blockchain_hashing_and_anchoring`
12. `tests/blockchain/test_contracts.py::test_credential_status_anchor_integrity`
13. `tests/security/test_security.py::test_unauthorized_access_rejection`
14. `tests/security/test_security.py::test_forged_bearer_token`
15. `tests/security/test_security.py::test_cross_user_isolation`
16. `tests/security/test_security.py::test_no_private_keys_exposed`
17. `tests/security/test_security.py::test_argon2id_hash_format`
18. `tests/test_e2e_flow.py::test_full_system_flow`

---

## 🔧 Troubleshooting Common Issues

### 1. "Port 8000 or 3000 is already in use"
- **Solution**: Double-click `stop.bat` to terminate lingering processes, or launch using `launch.bat` which automatically reclaims occupied ports.

### 2. "ModuleNotFoundError: No module named 'fastapi'"
- **Solution**: Verify backend dependencies are installed:
  ```powershell
  cd backend
  pip install -r requirements.txt
  ```

### 3. "npm is not recognized as an internal or external command"
- **Solution**: Install Node.js from [nodejs.org](https://nodejs.org/) and reopen your terminal.

### 4. "Database Error"
- **Solution**: Delete `backend/idone.db` if the database schema ever becomes corrupt. It will be automatically recreated on the next backend startup.

---

## 📚 Documentation Reference

- **[README.md](README.md)**: Master project overview, architecture, security model, and API specs.
- **[HOW_TO_RUN.md](HOW_TO_RUN.md)**: This launch and testing manual.
- **[HOW_TO_PUSH_TO_GITHUB.txt](HOW_TO_PUSH_TO_GITHUB.txt)**: Git setup and remote publishing instructions.
- **`1_How_To_Use_IDone.pdf`**: Complete user manual with visual UI mockups (8 Pages).
- **`2_How_IDone_Works.pdf`**: Deep-dive technical architecture and cryptographic design (8 Pages).
- **`3_IDone_Project_Overview.pdf`**: Technology stack breakdown and file catalog (5 Pages).

---

> **IDone** — *Your Identity. Your Credentials. Your Control.*
