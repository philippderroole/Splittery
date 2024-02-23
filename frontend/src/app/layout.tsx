import { Box, ChakraProvider, Flex, Hide, Show } from "@chakra-ui/react";
import Footer from "./components/footer";
import Navbar from "./components/navbar";

import { Inter, Roboto } from "next/font/google";

const inter = Inter({
    subsets: ["latin"],
    display: "swap",
});

const roboto = Roboto({
    weight: "400",
    subsets: ["latin"],
    display: "swap",
});

export default async function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    const sizeBreakpoint = (
        <Box position={"fixed"} top={0} left={0} zIndex={1000} padding={2}>
            <Show above="base">
                <Hide above="sm">
                    <p>base</p>
                </Hide>
            </Show>
            <Show above="sm">
                <Hide above="md">
                    <p>sm</p>
                </Hide>
            </Show>
            <Show above="md">
                <Hide above="lg">
                    <p>md</p>
                </Hide>
            </Show>
            <Show above="lg">
                <Hide above="xl">
                    <p>lg</p>
                </Hide>
            </Show>
            <Show above="xl">
                <Hide above="2xl">
                    <p>xl</p>
                </Hide>
            </Show>
            <Show above="2xl">
                <p>2xl</p>
            </Show>
        </Box>
    );

    return (
        <html lang="en" className={inter.className}>
            <head>
                <link rel="icon" href="/favicon.ico" />
            </head>
            <body>
                <ChakraProvider>
                    <Flex
                        direction="column"
                        minHeight="100vh"
                        justifyContent="space-between">
                        <Flex flexGrow={1} direction="column">
                            <Navbar />
                            {children}
                            {process.env.NEXT_PUBLIC_SHOW_SIZE_BREAKPOINTS ===
                            "true"
                                ? sizeBreakpoint
                                : null}
                        </Flex>
                        <Footer />
                    </Flex>
                </ChakraProvider>
            </body>
        </html>
    );
}
