import {
    ChakraProvider,
    Divider,
    Flex,
    Grid,
    GridItem,
    Hide,
    Show,
} from "@chakra-ui/react";
import AppTitle from "./AppTitle";
import CopyUrl from "./CopyUrl";
import { DarkModeSwitch } from "./DarkModeSwitch";
import IconBar from "./IconBar";
import ShareActivity from "./ShareActivity";

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
                                <Hide below="70em">
                                    <CopyUrl />
                                </Hide>
                                <Show below="70em">
                                    <ShareActivity></ShareActivity>
                                </Show>
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
                                <Hide below="35em">
                                    <IconBar />
                                </Hide>
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
