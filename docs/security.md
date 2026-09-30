# IDone Security Architecture & Threat Model

This document outlines the cryptographic specifications, privacy guarantees, and threat mitigations implemented across the IDone Decentralized Identity Vault.

---

## 1. Threat Model & Security Objectives

| Threat Scenario | Potential Impact | IDone Mitigation |
| :--- | :--- | :--- |
| **Database Compromise** | Exposure of stored credentials or passwords | Vault items are encrypted via AES-256-GCM. Passwords use memory-hard Argon2id hashes. No plaintext secrets stored. |
| **Credential Tampering** | Malicious alteration of credential attributes (e.g. GPA, name) | Ed25519 digital signatures cover canonicalized JSON (RFC 8785). Modifying a single character invalidates the signature. |
| **Identity Impersonation** | Rogue actor claiming another user's DID | DID verification methods link identity ownership directly to public keys. Private keys never leave user control unencrypted. |
| **Blockchain Data Leakage** | PII permanently inscribed on immutable public ledgers | Zero PII is sent to blockchain contracts. Only SHA-256 / Keccak-256 status hashes are registered on-chain. |
| **Revocation Bypass** | Presenting an expired or revoked credential | Verification engine checks both expiration timestamps and live on-chain / registry revocation lists. |
| **Replay Attacks** | Replaying intercepted credential presentations | Presentations include unique verification tokens, timestamps, and recipient audience restrictions. |

---

## 2. Cryptographic Specifications

### 2.1 Password Hashing: Argon2id
IDone utilizes **Argon2id** (the hybrid version of Argon2) for all password hashing:
- **Memory Cost ($m$)**: 65,536 KiB (64 MiB)
- **Time Cost / Iterations ($t$)**: 2 iterations
- **Parallelism / Lanes ($p$)**: 1 lane
- **Salt**: 16 cryptographically secure pseudo-random bytes (`os.urandom(16)`)
- **PHC Format**: Standard string representation `$argon2id$v=19$m=65536,t=2,p=1$...`

This configuration provides formidable resistance against specialized ASIC and GPU brute-force attacks while remaining efficient for interactive login workflows.

---

### 2.2 Symmetric Encryption: AES-256-GCM
Symmetric encryption is applied to all sensitive vault assets and private key representations:
- **Algorithm**: Advanced Encryption Standard in Galois/Counter Mode (AES-GCM).
- **Key Length**: 256 bits (32 bytes).
- **Nonce / Initialization Vector (IV)**: 96 bits (12 bytes) uniquely generated per encryption cycle using cryptographically secure random sources. Nonce reuse is strictly prohibited.
- **Authentication Tag**: 128 bits (16 bytes) providing both confidentiality and cryptographic integrity. If ciphertext is altered in transit or in storage, decryption fails immediately.

---

### 2.3 Asymmetric Signatures: Ed25519
Decentralized identities and Verifiable Credentials rely on the **Ed25519** signature scheme (EdDSA over Curve25519):
- **RFC 8032 Compliant**: High-speed signature generation and verification.
- **Small Footprint**: 32-byte public keys and 64-byte signatures.
- **Side-Channel Resilience**: Immune to timing attacks and cache attacks.
- **Standardized W3C Suite**: Represented as `Ed25519Signature2020` in Verifiable Credentials and `Ed25519VerificationKey2020` in DID documents.

---

### 2.4 Canonicalization Scheme: RFC 8785 (JCS)
JSON objects in modern web applications can have non-deterministic key ordering and whitespace. To guarantee reproducible signature verification across different languages (Python backend, TypeScript frontend), IDone applies JSON Canonicalization Scheme (JCS):
- Lexicographically sorted dictionary keys.
- Stripped optional whitespace around delimiters.
- Deterministic UTF-8 encoding.

---

## 3. Zero-Knowledge Digital Vault Architecture

The IDone vault operates under the principle of minimal server trust:
1. **Client-Side Derivation**: During vault item creation, the frontend can encrypt the payload using browser `crypto.subtle` (WebCrypto API) before transmitting ciphertext to the backend API.
2. **Server-Side Defense-in-Depth**: The backend further enforces authenticated storage with server-managed key encryption and checks that only the authorized identity controller has read access.
3. **No Plaintext Logging**: Private keys, unencrypted vault payloads, and session secrets are strictly stripped from server and browser logging pipelines.

---

## 4. Smart Contract Revocation Model

Smart contracts are deployed on EVM-compatible blockchains to act as independent trust registries:
- `IdentityRegistry.sol`:
  - Enforces `onlyIdentityOwner` modifier on status modifications.
  - Maintains immutable timestamp records of initial registration.
- `CredentialStatus.sol`:
  - Only the accredited `issuer` who initially anchored a credential hash may issue a revocation.
  - Stores a 32-byte `reasonHash` rather than raw text to prevent leaking reasons for disciplinary or sensitive status changes publicly.
