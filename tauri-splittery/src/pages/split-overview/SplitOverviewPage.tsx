import { Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { CreateSplitDialogButton } from "./components/create-split-dialog-button";

export default function SplitOverviewPage() {
    const [splits, setSplits] = useState([]);

    const apiUrl = import.meta.env.VITE_API_URL;
    const fetchSplits = async () => {
        await fetch(`${apiUrl}/splits`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setSplits(data);
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };

    useEffect(() => {
        fetchSplits();
    }, []);

    return (
        <>
            <Typography variant="h1">Splittery</Typography>
            <CreateSplitDialogButton />
        </>
    );
}
