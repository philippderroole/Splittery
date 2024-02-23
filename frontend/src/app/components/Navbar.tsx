import { Flex } from "@chakra-ui/react";
import Logo from "./Logo";

export default function Navbar() {
    return (
        <>
            <Flex
                direction="row"
                alignItems="center"
                justifyContent={["center", null, "left"]}
                marginLeft={["0", null, "30"]}>
                <Logo></Logo>
            </Flex>
        </>
    );
}
