import { Typography } from "@mui/material";
import Link from "next/link";

export default function HomePage() {
    return (
        <>
            <Typography variant="h1">Splittery</Typography>
            <Link href={"/splits/1"}>Go to split 1</Link>
        </>
    );
}
