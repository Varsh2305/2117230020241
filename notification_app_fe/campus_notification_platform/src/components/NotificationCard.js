"use client";

import { useEffect } from "react";
import {
  Card, CardContent, Typography, Chip, Box, Fade,
} from "@mui/material";
import WorkIcon from "@mui/icons-material/Work";
import SchoolIcon from "@mui/icons-material/School";
import EventIcon from "@mui/icons-material/Event";
import { markAsRead } from "../utils/readState";
import { Log } from "../../../logging_middleware";

const TYPE_CONFIG = {
  Placement: { color: "#1a73e8", bg: "#e8f0fe", Icon: WorkIcon },
  Result:    { color: "#137333", bg: "#e6f4ea", Icon: SchoolIcon },
  Event:     { color: "#b45309", bg: "#fef3c7", Icon: EventIcon },
};

/**
 * @param {{ notification: object, rank?: number }} props
 */
export default function NotificationCard({ notification, rank }) {
  const config = TYPE_CONFIG[notification.Type] ?? TYPE_CONFIG.Event;
  const Icon = config.Icon;

  useEffect(() => {
    if (!notification.read) {
      markAsRead(notification.ID);
      Log("frontend", "debug", "component", `Marked notification ${notification.ID} as read`);
    }
  }, [notification.ID, notification.read]);

  const formattedTime = new Date(notification.Timestamp).toLocaleString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

  return (
    <Fade in timeout={300}>
      <Card
        elevation={notification.read ? 0 : 2}
        sx={{
          mb: 1.5,
          border: "1px solid",
          borderColor: notification.read ? "#e0e0e0" : config.color + "44",
          borderLeft: `4px solid ${config.color}`,
          borderRadius: 2,
          backgroundColor: notification.read ? "#fafafa" : "#ffffff",
          transition: "all 0.2s ease",
          "&:hover": { transform: "translateX(4px)", boxShadow: 3 },
        }}
      >
        <CardContent sx={{ py: 1.5, px: 2, "&:last-child": { pb: 1.5 } }}>
          <Box display="flex" alignItems="flex-start" gap={1.5}>
            {rank && (
              <Typography
                variant="caption"
                sx={{ fontWeight: 700, color: config.color, minWidth: 24, pt: 0.3, fontFamily: "monospace" }}
              >
                #{rank}
              </Typography>
            )}
            <Box
              sx={{
                p: 0.8, borderRadius: "50%", backgroundColor: config.bg,
                display: "flex", alignItems: "center", flexShrink: 0,
              }}
            >
              <Icon sx={{ color: config.color, fontSize: 18 }} />
            </Box>
            <Box flex={1} minWidth={0}>
              <Box display="flex" alignItems="center" gap={1} mb={0.3} flexWrap="wrap">
                <Chip
                  label={notification.Type}
                  size="small"
                  sx={{
                    backgroundColor: config.bg, color: config.color,
                    fontWeight: 600, fontSize: "0.65rem", height: 20,
                  }}
                />
                {!notification.read && (
                  <Box sx={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: config.color }} />
                )}
              </Box>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: notification.read ? 400 : 600,
                  color: notification.read ? "#666" : "#1a1a1a",
                  textTransform: "capitalize",
                }}
              >
                {notification.Message}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.3, display: "block" }}>
                {formattedTime}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Fade>
  );
}