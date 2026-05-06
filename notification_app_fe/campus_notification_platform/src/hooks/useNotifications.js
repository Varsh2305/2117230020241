import { useState, useEffect, useCallback } from "react";
import { Log } from "../../../logging_middleware";

const API_BASE = process.env.NEXT_PUBLIC_NOTIFICATION_API;
const TOKEN = process.env.NEXT_PUBLIC_AUTH_TOKEN;

/**
 * @param {{ limit?: number, page?: number, notification_type?: string }} opts
 */
export function useNotifications(opts = {}) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    await Log("frontend", "info", "hook", "Initiating notifications fetch");

    try {
      const params = new URLSearchParams();
      if (opts.limit) params.set("limit", String(opts.limit));
      if (opts.page) params.set("page", String(opts.page));
      if (opts.notification_type) params.set("notification_type", opts.notification_type);

      const url = `${API_BASE}${params.toString() ? "?" + params.toString() : ""}`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${TOKEN}` },
      });

      if (!res.ok) throw new Error(`API error: ${res.status}`);

      const data = await res.json();

      // Enrich with read status from localStorage
      const readIds = JSON.parse(
        localStorage.getItem("readNotifications") ?? "[]"
      );
      const enriched = data.notifications.map((n) => ({
        ...n,
        read: readIds.includes(n.ID),
      }));

      setNotifications(enriched);
      await Log("frontend", "info", "hook", `Fetched ${enriched.length} notifications`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setError(msg);
      await Log("frontend", "error", "hook", `Notification fetch failed: ${msg}`);
    } finally {
      setLoading(false);
    }
  }, [opts.limit, opts.page, opts.notification_type]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { notifications, loading, error, refetch: fetchData };
}