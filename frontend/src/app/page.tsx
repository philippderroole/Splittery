"use server";

import { Center } from "@chakra-ui/react";
import Hero from "./components/Hero";

export default async function LandingPage() {
    return (
        <>
            <Center flexGrow={1}>
                <Hero />
            </Center>
        </>
    );
}
