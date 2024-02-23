"use client";

import { Box, Heading, useColorModeValue } from "@chakra-ui/react";

export default function LayoutBox({
    name,
    children,
    size,
}: {
    name: string;
    children?: React.ReactNode;
    size?: string[];
}) {
    const backgroundColor = useColorModeValue(
        "blackAlpha.100",
        "whiteAlpha.200"
    );

    return (
        <>
            <Box
                backdropBlur={10}
                backdropFilter="blur(10px)"
                backgroundColor={backgroundColor}
                paddingX={5}
                paddingY={3}
                margin={5}
                borderRadius={10}
                width={size}>
                <Heading size="md" paddingTop={2} marginBottom={3}>
                    {name}
                </Heading>
                {children}
            </Box>
        </>
    );
}
