import { Flex } from "@chakra-ui/react";
import Logo from "./logo";

export default function Navbar() {
    return (
        <>
            <Flex
                direction="row"
                alignItems="center"
                justifyContent="left"
                paddingLeft="10em">
                <Logo></Logo>
            </Flex>
        </>
    );
}
