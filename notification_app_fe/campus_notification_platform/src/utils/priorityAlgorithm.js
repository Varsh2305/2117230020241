import { Log } from "../../../logging_middleware";

// Placement is most important, then Result, then Event
const TYPE_WEIGHT = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

function scoreNotification(notification, maxTimestamp) {
  const weight = TYPE_WEIGHT[notification.Type] ?? 0;
  const ts = new Date(notification.Timestamp).getTime();
  const recency = maxTimestamp > 0 ? ts / maxTimestamp : 0;
  // Type weight dominates; recency breaks ties within same type
  return weight * 1000 + recency * 1000;
}

/**
 * Returns top N notifications sorted by priority score
 * @param {Array} notifications
 * @param {number} n
 * @returns {Promise<Array>}
 */
export async function getTopNNotifications(notifications, n) {
  await Log("frontend", "info", "utils", `Computing top ${n} from ${notifications.length} notifications`);

  if (!notifications.length) {
    await Log("frontend", "debug", "utils", "Empty array passed to priority algorithm");
    return [];
  }

  const maxTimestamp = Math.max(
    ...notifications.map((item) => new Date(item.Timestamp).getTime())
  );

  const scored = notifications
    .map((notif) => ({
      ...notif,
      score: scoreNotification(notif, maxTimestamp),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, n);

  await Log("frontend", "info", "utils", `Priority algorithm returned ${scored.length} notifications`);
  return scored;
}