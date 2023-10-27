import { Heading } from "@chakra-ui/react";
import Link from "next/link";

export default async function AppTitle() {
    return (
        <>
            <Link href="/">
                <Heading size={["lg", "2xl"]} whiteSpace="nowrap">
                    Share Expenses
                </Heading>
            </Link>
        </>
    );
}
