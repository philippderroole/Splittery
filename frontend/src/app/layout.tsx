import { ChakraProvider, Flex } from "@chakra-ui/react";
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
                        </Flex>
                        <Footer />
                    </Flex>
                </ChakraProvider>
            </body>
        </html>
    );
}
