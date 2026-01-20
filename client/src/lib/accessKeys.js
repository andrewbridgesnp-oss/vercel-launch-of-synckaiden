function base64urlEncode(bytes) {
  const bin = String.fromCharCode(...bytes);
  const b64 = btoa(bin);
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64urlDecodeToBytes(str) {
  const b64 = str.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((str.length + 3) % 4);
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i += 1) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

async function hmacSha256(secret, message) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  return new Uint8Array(sig);
}

export async function generateAccessKey({ secret, daysValid = 365 }) {
  const exp = new Date();
  exp.setDate(exp.getDate() + Math.max(1, Number(daysValid) || 365));
  const payload = {
    v: 1,
    plan: "pro",
    expISO: exp.toISOString(),
    nonce: Math.random().toString(16).slice(2) + Date.now().toString(16),
  };
  const payloadB64 = base64urlEncode(new TextEncoder().encode(JSON.stringify(payload)));
  const sigBytes = await hmacSha256(secret, payloadB64);
  const sigB64 = base64urlEncode(sigBytes);
  return `SYNK1.${payloadB64}.${sigB64}`;
}

export async function verifyAccessKey({ secret, key }) {
  try {
    if (!key || typeof key !== "string") return { ok: false, reason: "Empty key" };
    const parts = key.trim().split(".");
    if (parts.length !== 3 || parts[0] !== "SYNK1") return { ok: false, reason: "Bad format" };
    const payloadB64 = parts[1];
    const sigB64 = parts[2];

    const expectedSigBytes = await hmacSha256(secret, payloadB64);
    const expectedSigB64 = base64urlEncode(expectedSigBytes);
    if (expectedSigB64 !== sigB64) return { ok: false, reason: "Invalid signature" };

    const payloadBytes = base64urlDecodeToBytes(payloadB64);
    const payload = JSON.parse(new TextDecoder().decode(payloadBytes));
    if (payload?.plan !== "pro") return { ok: false, reason: "Wrong plan" };
    const expISO = payload?.expISO;
    if (!expISO) return { ok: false, reason: "Missing expiration" };
    if (new Date(expISO).getTime() < Date.now()) return { ok: false, reason: "Expired" };

    return { ok: true, payload };
  } catch (e) {
    return { ok: false, reason: String(e?.message || e) };
  }
}
