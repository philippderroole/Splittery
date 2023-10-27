import {
    ChakraProvider,
    Divider,
    Flex,
    Grid,
    GridItem,
} from "@chakra-ui/react";
import AppTitle from "./AppTitle";
import CopyUrl from "./CopyUrl";
import { DarkModeSwitch } from "./DarkModeSwitch";
import IconBar from "./IconBar";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <html>
            <head></head>
            <body>
                <ChakraProvider>
                    <Grid
                        height="7vh"
                        paddingLeft="1.5vw"
                        paddingRight="1.5vw"
                        alignItems="center"
                        templateColumns="repeat(3, 1fr)">
                        <GridItem>
                            <Flex
                                direction="row"
                                alignItems="center"
                                justifyContent="left">
                                <CopyUrl />
                            </Flex>
                        </GridItem>
                        <GridItem>
                            <Flex
                                direction="row"
                                alignItems="center"
                                justifyContent="center">
                                <AppTitle />
                            </Flex>
                        </GridItem>
                        <GridItem justifyContent="right">
                            <Flex
                                direction="row"
                                alignItems="center"
                                justifyContent="right"
                                gap="0.5vw">
                                <IconBar />
                                <DarkModeSwitch />
                            </Flex>
                        </GridItem>
                    </Grid>
                    <Divider />
                    {children}
                </ChakraProvider>
            </body>
        </html>
    );
}
