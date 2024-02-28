import { Flex } from "@chakra-ui/react";
import { DarkModeSwitch } from "./DarkModeSwitch";
import Logo from "./Logo";

export default function Navbar() {
    return (
        <>
            <Flex
                height={{ md: 100 }}
                //bgGradient="linear(to-r, green.100, green.100, green.100)"
                direction="row"
                alignItems="center"
                justifyContent={{ sm: "center", md: "space-between" }}
                padding={{ sm: 21, md: 30, lg: 50 }}>
                <Logo />
                <DarkModeSwitch scale={1.3} />
            </Flex>
        </>
    );
}
