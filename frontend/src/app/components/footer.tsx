"use client";

import {
    Box,
    Container,
    Flex,
    Stack,
    Text,
    useColorModeValue,
} from "@chakra-ui/react";
import IconBar from "./icon-bar";
import IconText from "./icon-text";

export default function Footer() {
    return (
        <Box
            bg={useColorModeValue("gray.50", "gray.900")}
            color={useColorModeValue("gray.700", "gray.200")}
            width="100%">
            <Container
                as={Stack}
                maxW={"6xl"}
                paddingY={4}
                direction={{ base: "column", md: "row" }}
                spacing={4}
                justify={{ base: "center", md: "space-between" }}
                alignItems="center">
                <IconText width={130} height={30} />
                <Text>© 2024 Splittery. All rights reserved</Text>
                <Flex
                    width={130}
                    height={30}
                    marginRight={-2}
                    justifyContent={{ base: "center", md: "right" }}>
                    <IconBar />
                </Flex>
            </Container>
        </Box>
    );
}
