import { Flex, Hide } from "@chakra-ui/react";
import { DarkModeSwitch } from "./DarkModeSwitch";
import Logo from "./Logo";

export default function Navbar() {
    return (
        <>
            <Flex
                height={100}
                direction="row"
                alignItems="center"
                justifyContent={{ base: "center", md: "space-between" }}
                padding={{ base: 21, md: 30, lg: 50 }}>
                <Logo />
                <Hide below="md">
                    <DarkModeSwitch scale={1.3} />
                </Hide>
            </Flex>
        </>
    );
}
