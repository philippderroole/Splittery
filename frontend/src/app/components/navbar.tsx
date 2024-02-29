import { Flex, Hide } from "@chakra-ui/react";
import { DarkModeSwitch } from "./dark-mode-switch";
import IconText from "./icon-text";

export default function Navbar() {
    return (
        <>
            <Flex
                height={100}
                direction="row"
                alignItems="center"
                justifyContent={{ base: "center", md: "space-between" }}
                padding={{ base: 21, md: 30, lg: 50 }}>
                <IconText width={200} height={100} />
                <Hide below="md">
                    <DarkModeSwitch scale={1.3} />
                </Hide>
            </Flex>
        </>
    );
}
