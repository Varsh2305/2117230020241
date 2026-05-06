"use client";

import { useState, useEffect } from "react";
import {
  Container, Typography, Box, AppBar, Toolbar, Button,
  CircularProgress, Alert, Slider, Chip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import Link from "next/link";
import { useNotifications } from "../../hooks/useNotifications";
import { getTopNNotifications } from "../../utils/priorityAlgorithm";
import NotificationCard from "../../components/NotificationCard";
import { Log } from "../../logging_middleware";

export default function PriorityInboxPage() {
  const [topN, setTopN] = useState(10);
  const [prioritized, setPrioritized] = useState([]);
  const [computing, setComputing] = useState(false);

  const { notifications, loading, error, refetch } = useNotifications({ limit: 100 });

  useEffect(() => {
    Log("frontend", "info", "page", "Priority Inbox page mounted");
  }, []);

  useEffect(() => {
    if (!notifications.length) return;
    setComputing(true);
    getTopNNotifications(notifications, topN).then((result) => {
      setPrioritized(result);
      setComputing(false);
    });
  }, [notifications, topN]);

  const counts = {
    Placement: prioritized.filter((n) => n.Type === "Placement").length,
    Result: prioritized.filter((n) => n.Type === "Result").length,
    Event: prioritized.filter((n) => n.Type === "Event").length,
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#0f0e17" }}>
      <AppBar position="sticky" elevation={0}
        sx={{ backgroundColor: "#0f0e17", borderBottom: "1px solid #2d2d2d" }}>
        <Toolbar>
          <Button component={Link} href="/" startIcon={<ArrowBackIcon />}
            sx={{ color: "#a7a9be", textTransform: "none", mr: 2 }}>
            Back
          </Button>
          <EmojiEventsIcon sx={{ color: "#ffd700", mr: 1 }} />
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#fffffe", flexGrow: 1 }}>
            Priority Inbox
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{
          background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
          borderRadius: 3, p: 3, mb: 4, border: "1px solid #2d2d4e",
        }}>
          <Typography color="#a7a9be" variant="body2" mb={1}>
            Showing top <strong style={{ color: "#ffd700" }}>{topN}</strong> notifications
          </Typography>
          <Slider
            value={topN} min={5} max={20} step={5}
            marks={[{ value: 5, label: "5" }, { value: 10, label: "10" },
                    { value: 15, label: "15" }, { value: 20, label: "20" }]}
            onChange={(_, val) => setTopN(val)}
            sx={{ color: "#ffd700", "& .MuiSlider-markLabel": { color: "#a7a9be" } }}
          />
          <Box display="flex" gap={1} mt={2} flexWrap="wrap">
            {[
              { label: `${counts.Placement} Placement`, color: "#1a73e8" },
              { label: `${counts.Result} Result`, color: "#137333" },
              { label: `${counts.Event} Event`, color: "#b45309" },
            ].map((c) => (
              <Chip key={c.label} label={c.label} size="small"
                sx={{ backgroundColor: c.color + "22", color: c.color,
                      fontWeight: 600, border: `1px solid ${c.color}44` }} />
            ))}
          </Box>
        </Box>

        {(loading || computing) && (
          <Box display="flex" justifyContent="center" py={6}>
            <CircularProgress sx={{ color: "#ffd700" }} />
          </Box>
        )}

        {error && (
          <Alert severity="error" action={<Button onClick={refetch}>Retry</Button>}>
            {error}
          </Alert>
        )}

        {!loading && !computing && prioritized.map((n, i) => (
          <NotificationCard key={n.ID} notification={n} rank={i + 1} />
        ))}
      </Container>
    </Box>
  );
}