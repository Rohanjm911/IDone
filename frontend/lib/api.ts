/**
 * Typed API Client for IDone Backend Services
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export interface User {
  id: string;
  email: string;
  full_name: string;
  is_active: boolean;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface Identity {
  id: string;
  did: string;
  public_key_hex: string;
  status: string;
  verification_method: string;
  blockchain_tx_hash?: string;
  created_at: string;
}

export interface Credential {
  id: string;
  credential_id: string;
  type_name: string;
  title: string;
  issuer_did: string;
  issuer_name: string;
  subject_did: string;
  issuance_date: string;
  expiration_date?: string;
  status: "VALID" | "REVOKED" | "EXPIRED" | "SUSPENDED";
  revocation_reason?: string;
  blockchain_hash?: string;
  raw_credential_json: string;
  created_at: string;
}

export interface VaultItem {
  id: string;
  name: string;
  category: "Identity" | "Education" | "Professional" | "Certificates" | "Documents" | "Other" | string;
  is_encrypted: boolean;
  encrypted_payload: string;
  iv: string;
  auth_tag?: string;
  metadata_json?: string;
  created_at: string;
  last_accessed: string;
}

export interface Activity {
  id: string;
  action_type: string;
  description: string;
  metadata_json?: string;
  timestamp: string;
}

export interface SecurityStatus {
  vault_encrypted: boolean;
  identity_active: boolean;
  credentials_protected: boolean;
  no_suspicious_activity: boolean;
  security_score: number;
  total_credentials: number;
  verified_credentials: number;
  vault_items_count: number;
  last_security_check: string;
}

export interface VerificationCheck {
  name: string;
  passed: boolean;
  details: string;
}

export interface VerificationResult {
  is_valid: boolean;
  status: string;
  issuer_name?: string;
  issuer_did?: string;
  holder_did?: string;
  type_name?: string;
  title?: string;
  issuance_date?: string;
  expiration_date?: string;
  signature_valid: boolean;
  status_active: boolean;
  integrity_verified: boolean;
  blockchain_hash?: string;
  checks: VerificationCheck[];
  error_message?: string;
}

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("idone_access_token");
}

export function setAuthToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("idone_access_token", token);
  }
}

export function removeAuthToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("idone_access_token");
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    let errorDetail = `Request failed: ${res.statusText}`;
    try {
      const errJson = await res.json();
      if (errJson.detail) {
        errorDetail = typeof errJson.detail === "string" ? errJson.detail : JSON.stringify(errJson.detail);
      }
    } catch {
      // ignore
    }
    throw new Error(errorDetail);
  }

  return res.json() as Promise<T>;
}

// Authentication
export async function registerUser(payload: {
  full_name: string;
  email: string;
  password: string;
  confirm_password: string;
}): Promise<AuthResponse> {
  const res = await request<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  setAuthToken(res.access_token);
  return res;
}

export async function loginUser(payload: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const res = await request<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  setAuthToken(res.access_token);
  return res;
}

export async function getCurrentUser(): Promise<User> {
  return request<User>("/auth/me");
}

export function logoutUser() {
  removeAuthToken();
}

// Identity
export async function getIdentity(): Promise<Identity> {
  return request<Identity>("/identity");
}

export async function rotateIdentityKey(): Promise<Identity> {
  return request<Identity>("/identity/rotate-key", { method: "POST" });
}

export async function resolveDID(did: string): Promise<any> {
  return request<any>(`/identity/resolve/${encodeURIComponent(did)}`);
}

// Credentials
export async function getCredentials(statusFilter?: string): Promise<Credential[]> {
  const query = statusFilter ? `?status=${statusFilter}` : "";
  return request<Credential[]>(`/credentials${query}`);
}

export async function getCredential(id: string): Promise<Credential> {
  return request<Credential>(`/credentials/${id}`);
}

export async function issueCredential(payload: {
  type_name: string;
  title: string;
  issuer_name?: string;
  claims: Record<string, any>;
  expiration_days?: number;
}): Promise<Credential> {
  return request<Credential>("/credentials", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function importCredential(raw_credential_json: string): Promise<Credential> {
  return request<Credential>("/credentials/import", {
    method: "POST",
    body: JSON.stringify({ raw_credential_json }),
  });
}

export async function deleteCredential(id: string): Promise<{ message: string }> {
  return request<{ message: string }>(`/credentials/${id}`, { method: "DELETE" });
}

export async function shareCredential(
  id: string,
  payload: {
    recipient_email: string;
    shared_fields: string[];
    include_personal_info: boolean;
  }
): Promise<{ recipient_email: string; share_token: string; shared_payload: any; shared_at: string }> {
  return request<any>(`/credentials/${id}/share`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function revokeCredential(id: string, reason: string): Promise<{ message: string; status: string }> {
  return request<any>(`/credentials/${id}/revoke`, {
    method: "POST",
    body: JSON.stringify({ reason }),
  });
}

// Vault
export async function getVaultItems(category?: string): Promise<VaultItem[]> {
  const query = category && category !== "All" ? `?category=${category}` : "";
  return request<VaultItem[]>(`/vault${query}`);
}

export async function addVaultItem(payload: {
  name: string;
  category: string;
  is_encrypted: boolean;
  encrypted_payload: string;
  iv: string;
  auth_tag?: string;
  metadata_json?: string;
}): Promise<VaultItem> {
  return request<VaultItem>("/vault", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function deleteVaultItem(id: string): Promise<{ message: string }> {
  return request<{ message: string }>(`/vault/${id}`, { method: "DELETE" });
}

// Verification
export async function verifyCredentialData(credential_data: any): Promise<VerificationResult> {
  return request<VerificationResult>("/verify/credential", {
    method: "POST",
    body: JSON.stringify({ credential_data }),
  });
}

// Dashboard & Activity
export async function getActivityTimeline(): Promise<Activity[]> {
  return request<Activity[]>("/activity");
}

export async function getSecurityStatus(): Promise<SecurityStatus> {
  return request<SecurityStatus>("/security/status");
}
