const SESSION_KEY_NAME = "synckaiden_client_cipher_v1";
const ENV_SECRET = import.meta.env.VITE_CLIENT_ENCRYPTION_KEY || "";

function getCrypto() {
  if (typeof globalThis.crypto !== "undefined") return globalThis.crypto;
  return null;
}

function toBase64(bytes) {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(bytes).toString("base64");
  }
  let binary = "";
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  return btoa(binary);
}

function fromBase64(str) {
  if (typeof Buffer !== "undefined") {
    return new Uint8Array(Buffer.from(str, "base64"));
  }
  const bin = atob(str);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i += 1) out[i] = bin.charCodeAt(i);
  return out;
}

function resolveSecret() {
  if (ENV_SECRET) return ENV_SECRET;
  if (typeof window === "undefined") return "synckaiden-default";
  const existing = sessionStorage.getItem(SESSION_KEY_NAME);
  if (existing) return existing;
  const fresh = crypto.randomUUID ? crypto.randomUUID() : toBase64(crypto.getRandomValues(new Uint8Array(16)));
  sessionStorage.setItem(SESSION_KEY_NAME, fresh);
  return fresh;
}

async function getKey() {
  const cryptoAPI = getCrypto();
  if (!cryptoAPI?.subtle) throw new Error("WebCrypto unavailable");
  const secret = resolveSecret();
  const secretBytes = new TextEncoder().encode(secret);
  const hashed = await cryptoAPI.subtle.digest("SHA-256", secretBytes);
  return cryptoAPI.subtle.importKey("raw", hashed, "AES-GCM", false, ["encrypt", "decrypt"]);
}

export async function encryptValue(value) {
  const cryptoAPI = getCrypto();
  if (!cryptoAPI?.subtle) return value;
  const key = await getKey();
  const iv = cryptoAPI.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(value);
  const cipher = await cryptoAPI.subtle.encrypt({ name: "AES-GCM", iv }, key, encoded);
  const cipherBytes = new Uint8Array(cipher);
  const merged = new Uint8Array(iv.byteLength + cipherBytes.byteLength);
  merged.set(iv, 0);
  merged.set(cipherBytes, iv.byteLength);
  return toBase64(merged);
}

export async function decryptValue(payload) {
  try {
    const cryptoAPI = getCrypto();
    if (!cryptoAPI?.subtle) return payload;
    const bytes = fromBase64(payload);
    if (bytes.byteLength < 13) return null;
    const iv = bytes.slice(0, 12);
    const data = bytes.slice(12);
    const key = await getKey();
    const plainBuffer = await cryptoAPI.subtle.decrypt({ name: "AES-GCM", iv }, key, data);
    return new TextDecoder().decode(plainBuffer);
  } catch (e) {
    console.warn("decrypt failed", e);
    return null;
  }
}

export async function getDecryptedItem(key) {
  if (typeof localStorage === "undefined") return null;
  const raw = localStorage.getItem(key);
  if (!raw) return null;
  const decrypted = await decryptValue(raw);
  return decrypted;
}

export async function getDecryptedJSON(key) {
  try {
    const text = await getDecryptedItem(key);
    if (!text) return null;
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export async function setEncryptedItem(key, value) {
  if (typeof localStorage === "undefined") return;
  const encrypted = await encryptValue(value);
  localStorage.setItem(key, encrypted);
}

export async function setEncryptedJSON(key, value) {
  const serialized = JSON.stringify(value);
  await setEncryptedItem(key, serialized);
}

export async function clearStoredItem(key) {
  if (typeof localStorage === "undefined") return;
  localStorage.removeItem(key);
}
