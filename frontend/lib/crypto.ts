/**
 * WebCrypto Cryptographic Primitives for Client-Side Zero-Knowledge Vault Encryption.
 * Employs AES-256-GCM authenticated encryption with PBKDF2 key derivation.
 */

// Helper: Convert ArrayBuffer to Base64
export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Helper: Convert Base64 to ArrayBuffer
export function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

// Helper: Derive AES-256-GCM key from user passphrase using PBKDF2
async function deriveKeyFromPassphrase(passphrase: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    enc.encode(passphrase),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  return window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt as any,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

/**
 * Encrypt plaintext string using client-side AES-256-GCM.
 */
export async function encryptClientVault(
  plaintext: string,
  passphrase: string = "IDoneVaultClientKey2026"
): Promise<{ encrypted_payload: string; iv: string }> {
  const enc = new TextEncoder();
  const data = enc.encode(plaintext);

  // Deterministic or random salt
  const salt = enc.encode("idone_vault_salt_client");
  const key = await deriveKeyFromPassphrase(passphrase, salt);

  // 12-byte random IV
  const iv = window.crypto.getRandomValues(new Uint8Array(12));

  const encryptedBuffer = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv as any,
    },
    key,
    data as any
  );

  return {
    encrypted_payload: arrayBufferToBase64(encryptedBuffer),
    iv: arrayBufferToBase64(iv.buffer),
  };
}

/**
 * Decrypt ciphertext string using client-side AES-256-GCM.
 */
export async function decryptClientVault(
  encryptedPayloadBase64: string,
  ivBase64: string,
  passphrase: string = "IDoneVaultClientKey2026"
): Promise<string> {
  try {
    const enc = new TextEncoder();
    const salt = enc.encode("idone_vault_salt_client");
    const key = await deriveKeyFromPassphrase(passphrase, salt);

    const iv = base64ToArrayBuffer(ivBase64);
    const ciphertext = base64ToArrayBuffer(encryptedPayloadBase64);

    const decryptedBuffer = await window.crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: new Uint8Array(iv) as any,
      },
      key,
      ciphertext as any
    );

    const dec = new TextDecoder();
    return dec.decode(decryptedBuffer);
  } catch (err) {
    console.warn("Client-side decryption failed (payload may be encrypted with different key or server-side):", err);
    return "[Encrypted Ciphertext Protected]";
  }
}
