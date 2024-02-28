import { ChakraProvider, Flex } from "@chakra-ui/react";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";

import { Metadata } from "next";
import { Inter, Roboto } from "next/font/google";
import SizeDisplay from "./components/size-display";
import { theme } from "./theme";

const inter = Inter({
    subsets: ["latin"],
    display: "swap",
});

const roboto = Roboto({
    weight: "400",
    subsets: ["latin"],
    display: "swap",
});

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
    return (
        <html lang="en" className={inter.className}>
            <body>
                <ChakraProvider theme={theme}>
                    <Flex
                        direction="column"
                        minHeight="100vh"
                        justifyContent="space-between">
                        <Flex flexGrow={1} direction="column">
                            <Navbar />
                            {children}
                            <SizeDisplay />
                        </Flex>
                        <Footer />
                    </Flex>
                </ChakraProvider>
            </body>
        </html>
    );
}
