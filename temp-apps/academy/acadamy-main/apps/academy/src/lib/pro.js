const LS_PRO = "synckaiden_pro_unlocked";
const LS_PRO_META = "synckaiden_pro_meta";

export function isProUnlocked() {
  try {
    const unlocked = localStorage.getItem(LS_PRO) === "true";
    if (!unlocked) return false;
    const metaRaw = localStorage.getItem(LS_PRO_META);
    if (!metaRaw) return true;
    const meta = JSON.parse(metaRaw);
    if (meta?.expISO && new Date(meta.expISO).getTime() < Date.now()) {
      localStorage.removeItem(LS_PRO);
      localStorage.removeItem(LS_PRO_META);
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export function setProUnlocked(meta) {
  localStorage.setItem(LS_PRO, "true");
  if (meta) localStorage.setItem(LS_PRO_META, JSON.stringify(meta));
}

export function clearPro() {
  localStorage.removeItem(LS_PRO);
  localStorage.removeItem(LS_PRO_META);
}

export function getProMeta() {
  try {
    const raw = localStorage.getItem(LS_PRO_META);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
