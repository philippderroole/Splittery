import {
  Alert,
  Box,
  CircularProgress,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSplits } from "@/providers/splits-provider";
import { CreateSplitDialogButton } from "@/components/create-split-dialog-button";
import AccountMenu from "@/components/account-menu";

export default function SplitsPage() {
  const navigate = useNavigate();
  const { splits } = useSplits();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <Box
      sx={{
        minHeight: "100dvh",
        bgcolor: "background.default",
        p: { xs: 2, sm: 4 },
      }}
    >
      <AccountMenu />
      <Box sx={{ maxWidth: 720, mx: "auto" }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", sm: "center" }}
          spacing={{ xs: 2, sm: 0 }}
          mb={3}
        >
          <Box>
            <Typography
              variant="h4"
              fontWeight={700}
              sx={{ fontSize: { xs: "1.75rem", sm: "2.125rem" } }}
            >
              Your splits
            </Typography>
            <Typography color="text.secondary">
              Choose a split to continue.
            </Typography>
          </Box>
          <Box sx={{ alignSelf: { xs: "stretch", sm: "auto" } }}>
            <CreateSplitDialogButton />
          </Box>
        </Stack>

        {error && <Alert severity="error">{error}</Alert>}

        {isLoading ? (
          <Box sx={{ display: "grid", placeItems: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        ) : splits.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="h6" gutterBottom>
              No splits yet
            </Typography>
            <Typography color="text.secondary" mb={2}>
              Create a split to start tracking shared expenses.
            </Typography>
            <CreateSplitDialogButton />
          </Paper>
        ) : (
          <Paper>
            <List disablePadding>
              {splits.map((split) => (
                <ListItem key={split.id} disablePadding>
                  <ListItemButton
                    onClick={() => navigate(`/splits/${split.id}/balances`)}
                  >
                    <ListItemText primary={split.name} secondary="Open split" />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Paper>
        )}
      </Box>
    </Box>
  );
}
