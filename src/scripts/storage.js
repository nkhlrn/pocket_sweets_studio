/**
 * Pocket Sweets Studio — localStorage 資料儲存層
 * 負責管理「收藏甜點清單」與「個人製作紀錄（Craft Log）」。
 */

const FAV_KEY = "pss_favorites_v1";
const LOG_KEY = "pss_craft_logs_v1";

export function getFavorites() {
  try {
    const raw = localStorage.getItem(FAV_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function isFavorite(id) {
  return getFavorites().includes(id);
}

export function toggleFavorite(id) {
  const list = getFavorites();
  const idx = list.indexOf(id);
  if (idx >= 0) {
    list.splice(idx, 1);
  } else {
    list.push(id);
  }
  localStorage.setItem(FAV_KEY, JSON.stringify(list));
  window.dispatchEvent(new CustomEvent("pss:favorites-changed", { detail: list }));
  return list.includes(id);
}

export function getCraftLogs() {
  try {
    const raw = localStorage.getItem(LOG_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addCraftLog(entry) {
  const logs = getCraftLogs();
  const now = new Date().toISOString();
  const newLog = {
    id: `log-${Date.now()}`,
    dessertId: entry.dessertId || "",
    title: entry.title.trim(),
    scale: entry.scale || "1:12",
    status: entry.status || "規劃中",
    usedMaterials: (entry.usedMaterials || "")
      .split(/[、,，]/)
      .map((s) => s.trim())
      .filter(Boolean),
    notes: (entry.notes || "").trim(),
    createdAt: now,
    updatedAt: now
  };
  logs.unshift(newLog);
  localStorage.setItem(LOG_KEY, JSON.stringify(logs));
  return newLog;
}

export function deleteCraftLog(id) {
  const logs = getCraftLogs().filter((item) => item.id !== id);
  localStorage.setItem(LOG_KEY, JSON.stringify(logs));
  return logs;
}

export function updateCraftLogStatus(id, status) {
  const logs = getCraftLogs().map((item) =>
    item.id === id ? { ...item, status, updatedAt: new Date().toISOString() } : item
  );
  localStorage.setItem(LOG_KEY, JSON.stringify(logs));
  return logs;
}
