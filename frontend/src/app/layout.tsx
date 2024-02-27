import { Box, ChakraProvider, Flex, Hide, Show, Text } from "@chakra-ui/react";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";

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
                    <Text backgroundColor="ghostwhite">base</Text>
                </Hide>
            </Show>
            <Show above="sm">
                <Hide above="md">
                    <Text>sm</Text>
                </Hide>
            </Show>
            <Show above="md">
                <Hide above="lg">
                    <Text>md</Text>
                </Hide>
            </Show>
            <Show above="lg">
                <Hide above="xl">
                    <Text>lg</Text>
                </Hide>
            </Show>
            <Show above="xl">
                <Hide above="2xl">
                    <Text>xl</Text>
                </Hide>
            </Show>
            <Show above="2xl">
                <Text>2xl</Text>
            </Show>
        </Box>
    );

    return (
        <html lang="en" className={inter.className}>
            <head>
                <link rel="icon" href="/icon.svg" type="image/svg" />
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
