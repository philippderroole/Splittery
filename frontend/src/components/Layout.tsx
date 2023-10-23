import { ChakraProvider } from "@chakra-ui/react";

export default function Layout({ children }: { children: React.ReactNode }) {
    return <ChakraProvider>{children}</ChakraProvider>;
}
