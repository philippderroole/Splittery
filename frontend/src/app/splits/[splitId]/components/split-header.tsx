"use client";
import { useSplit } from "@/providers/split-provider";
import { Typography } from "@mui/material";

export default function SplitHeader() {
    const split = useSplit();

    return <Typography variant="h2">Split {split.name}</Typography>;
}
