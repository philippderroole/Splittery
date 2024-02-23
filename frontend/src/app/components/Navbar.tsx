import { Flex } from "@chakra-ui/react";
import { DarkModeSwitch } from "./DarkModeSwitch";
import Logo from "./Logo";

export default function Navbar() {
    return (
        <>
            <Flex
                direction="row"
                alignItems="center"
                justifyContent={["center", null, "left"]}
                marginLeft={["0", null, "39"]}>
                <Logo></Logo>
            </Flex>
            <DarkModeSwitch position="absolute" right={3} top={3} scale={0.9} />
        </>
    );
}
