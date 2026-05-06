export function getReadIds() {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem("readNotifications") ?? "[]");
}

export function markAsRead(id) {
  const current = getReadIds();
  if (!current.includes(id)) {
    localStorage.setItem(
      "readNotifications",
      JSON.stringify([...current, id])
    );
  }
}

export function isRead(id) {
  return getReadIds().includes(id);
}