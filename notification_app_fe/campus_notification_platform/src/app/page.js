"use client";

import { useState, useEffect } from "react";
import {
  Container, Typography, Box, ToggleButton, ToggleButtonGroup,
  CircularProgress, Alert, Pagination, AppBar, Toolbar, Button,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import StarIcon from "@mui/icons-material/Star";
import Link from "next/link";
import { useNotifications } from "../hooks/useNotifications";
import NotificationCard from "../components/NotificationCard";
import { Log } from "../logging_middleware";

export default function AllNotificationsPage() {
  const [filterType, setFilterType] = useState("");
  const [page, setPage] = useState(1);

  const { notifications, loading, error, refetch } = useNotifications({
    page,
    limit: 10,
    notification_type: filterType,
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    Log("frontend", "info", "page", "All Notifications page mounted");
  }, []);

  const handleFilter = (_, val) => {
    if (val !== null) {
      setFilterType(val);
      setPage(1);
      Log("frontend", "debug", "page", `Filter set to: ${val || "all"}`);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f5f7fa" }}>
      <AppBar position="sticky" elevation={0}
        sx={{ backgroundColor: "#1a1a2e", borderBottom: "1px solid #2d2d4e" }}>
        <Toolbar>
          <NotificationsIcon sx={{ mr: 1.5, color: "#7c83fd" }} />
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#fff", flexGrow: 1 }}>
            Campus Notifications
          </Typography>
          <Button
            component={Link} href="/priority"
            startIcon={<StarIcon />}
            sx={{
              color: "#ffd700", border: "1px solid #ffd70055",
              borderRadius: 2, textTransform: "none", fontWeight: 600,
              "&:hover": { backgroundColor: "#ffd70022" },
            }}
          >
            Priority Inbox
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
          <Box>
            <Typography variant="h5" fontWeight={700} color="#1a1a2e">
              All Notifications
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {unreadCount > 0 ? `${unreadCount} unread` : "All caught up!"}
            </Typography>
          </Box>
        </Box>

        <ToggleButtonGroup value={filterType} exclusive onChange={handleFilter}
          size="small" sx={{ mb: 3, flexWrap: "wrap", gap: 0.5 }}>
          {["", "Placement", "Result", "Event"].map((type) => (
            <ToggleButton key={type} value={type}
              sx={{
                textTransform: "none", fontWeight: 500,
                borderRadius: "20px !important", border: "1px solid #e0e0e0 !important", px: 2,
                "&.Mui-selected": { backgroundColor: "#1a1a2e", color: "#fff", borderColor: "#1a1a2e !important" },
              }}
            >
              {type || "All"}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>

        {loading && (
          <Box display="flex" justifyContent="center" py={6}>
            <CircularProgress sx={{ color: "#7c83fd" }} />
          </Box>
        )}

        {error && (
          <Alert severity="error" action={<Button onClick={refetch}>Retry</Button>}>
            {error}
          </Alert>
        )}

        {!loading && !error && notifications.length === 0 && (
          <Box textAlign="center" py={8}>
            <NotificationsIcon sx={{ fontSize: 64, color: "#ccc", mb: 2 }} />
            <Typography color="text.secondary">No notifications found.</Typography>
          </Box>
        )}

        {!loading && notifications.map((n) => (
          <NotificationCard key={n.ID} notification={n} />
        ))}

        {!loading && notifications.length > 0 && (
          <Box display="flex" justifyContent="center" mt={3}>
            <Pagination count={10} page={page}
              onChange={(_, val) => setPage(val)} color="primary" />
          </Box>
        )}
      </Container>
    </Box>
  );
}