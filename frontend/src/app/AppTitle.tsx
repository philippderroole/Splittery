import { Heading } from "@chakra-ui/react";
import Link from "next/link";

export default async function AppTitle() {
    return (
        <>
            <Link href="/">
                <Heading>Share Expenses</Heading>
            </Link>
        </>
    );
}
