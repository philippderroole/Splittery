import { Center } from "@chakra-ui/react";
import Hero from "./components/hero";

export default async function LandingPage() {
    return (
        <>
            <Center flexGrow={1}>
                <Hero />
            </Center>
        </>
    );
}
