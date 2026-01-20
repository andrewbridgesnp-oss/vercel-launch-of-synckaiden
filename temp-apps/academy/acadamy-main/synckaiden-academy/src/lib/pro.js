import { clearStoredItem, getDecryptedItem, getDecryptedJSON, setEncryptedItem, setEncryptedJSON } from "./secureStorage";

const LS_PRO = "synckaiden_pro_unlocked";
const LS_PRO_META = "synckaiden_pro_meta";

export async function isProUnlocked() {
  try {
    const unlocked = (await getDecryptedItem(LS_PRO)) === "true";
    if (!unlocked) return false;
    const meta = await getDecryptedJSON(LS_PRO_META);
    if (meta?.expISO && new Date(meta.expISO).getTime() < Date.now()) {
      await clearPro();
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export async function setProUnlocked(meta) {
  await setEncryptedItem(LS_PRO, "true");
  if (meta) await setEncryptedJSON(LS_PRO_META, meta);
}

export async function clearPro() {
  await clearStoredItem(LS_PRO);
  await clearStoredItem(LS_PRO_META);
}

export async function getProMeta() {
  try {
    const meta = await getDecryptedJSON(LS_PRO_META);
    return meta || null;
  } catch {
    return null;
  }
}
