import { ChakraProvider, Divider, Flex } from "@chakra-ui/react";
import Footer from "./Footer";
import Header from "./Header";

export default async function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html>
            <head></head>
            <body>
                <ChakraProvider>
                    <Flex
                        direction="column"
                        minHeight="100vh"
                        justifyContent="space-between">
                        <Flex flexGrow={1} direction="column">
                            <Header height="7vh" />
                            <Divider />
                            {children}
                        </Flex>
                        <Footer />
                    </Flex>
                </ChakraProvider>
            </body>
        </html>
    );
}
