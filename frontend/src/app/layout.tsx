import {
    Box,
    ChakraProvider,
    Flex,
    Hide,
    Show,
    Text,
    extendTheme,
} from "@chakra-ui/react";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";

import { Metadata } from "next";
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

export const metadata: Metadata = {
    title: "Splittery",
    description: "Splittery - Split expenses with friends",
    icons: {
        icon: [
            {
                media: "(prefers-color-scheme: light)",
                url: "icon-light.svg",
                href: "icon-light.svg",
            },
            {
                media: "(prefers-color-scheme: dark)",
                url: "icon-dark.svg",
                href: "icon-dark.svg",
            },
        ],
    },
};

export default async function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    const theme = extendTheme({
        colors: {
            brand: {
                dark: {
                    text: "#EDEDEE",
                    background: "#1A202D",
                    primary: "#98E6B5",
                    secondary: "#9F9FDC",
                    accent: "#4020C5",
                    warning: "#f6ad55",
                },
                light: {
                    text: "#1a202c",
                    background: "#FFFFFF",
                    primary: "#319795",
                    secondary: "#2c5282",
                    accent: "#f7fafc",
                    warning: "#f6ad55",
                },
            },
        },
    });

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
