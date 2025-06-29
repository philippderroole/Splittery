"use client";

import CreateUserButton from "@/components/create-user-button";
import UserList from "@/components/user-list";
import { Typography } from "@mui/material";
import { useSplit } from "../../../../providers/split-provider";

export default function SplitPage() {
    const split = useSplit();

    console.log("SplitPage split:", split);

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
            }}
        >
            <Typography variant="h4">Balances</Typography>
            <UserList
                users={split.users.map((user) => user.username)}
            ></UserList>
            <div
                style={{
                    position: "fixed",
                    bottom: "6rem",
                    right: "3rem",
                    zIndex: 1200,
                }}
            >
                <CreateUserButton split={split} />
            </div>
        </div>
    );
}
