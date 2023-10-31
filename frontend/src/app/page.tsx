import { Center } from "@chakra-ui/react";
import Hero from "./Hero";
import Statistics from "./Statistics";

export default async function HomePage() {
    return (
        <>
            <Center flexGrow={1}>
                <Hero />
            </Center>
            <Statistics paddingBottom="10vh" />
        </>
    );
}
