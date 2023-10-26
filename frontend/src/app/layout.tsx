import { ChakraProvider } from "@chakra-ui/react";
import { DarkModeSwitch } from "./DarkModeSwitch";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <html>
            <head></head>
            <body>
                <ChakraProvider>
                    {children}
                    <DarkModeSwitch />
                </ChakraProvider>
            </body>
        </html>
    );
}
