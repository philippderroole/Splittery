import {
    Flex,
    Grid,
    GridItem,
    Heading,
    Hide,
    Link,
    Show,
} from "@chakra-ui/react";
import CopyUrl from "./CopyUrl";
import { DarkModeSwitch } from "./DarkModeSwitch";
import IconBar from "./IconBar";
import ShareActivity from "./ShareActivity";

const AppTitle = () => {
    return (
        <>
            <Link href="/">
                <Heading size={["lg", "2xl"]} whiteSpace="nowrap">
                    Splittery
                </Heading>
            </Link>
        </>
    );
};

export default async function Header({ height }: { height?: any }) {
    return (
        <Grid
            height={height}
            paddingLeft="1.5vw"
            paddingRight="1.5vw"
            alignItems="center"
            templateColumns="repeat(3, 1fr)">
            <GridItem>
                <Flex direction="row" alignItems="center" justifyContent="left">
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
            <GridItem>
                <Flex
                    direction="row"
                    alignItems="center"
                    justifyContent="right"
                    gap="3vw">
                    <Hide below="35em">
                        <IconBar />
                    </Hide>
                    <DarkModeSwitch />
                </Flex>
            </GridItem>
        </Grid>
    );
}
