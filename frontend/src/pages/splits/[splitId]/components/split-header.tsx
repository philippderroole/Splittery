"use client";
import { useSplit } from "@/providers/split-provider";
import { Box, Typography } from "@mui/material";

export default function SplitHeader() {
  const split = useSplit();

  return (
    <Box>
      <Typography
        variant="overline"
        color="text.secondary"
        sx={{ fontWeight: 700, letterSpacing: "0.08em" }}
      >
        Shared expenses
      </Typography>
      <Typography
        variant="h4"
        sx={{ fontSize: { xs: "1.75rem", sm: "2.125rem" } }}
      >
        {split.name}
      </Typography>
    </Box>
  );
}
