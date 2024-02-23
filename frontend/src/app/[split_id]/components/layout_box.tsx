"use server";

import { Box, Heading } from "@chakra-ui/react";

export default async function LayoutBox({
    name,
    children,
    size,
}: {
    name: string;
    children?: React.ReactNode;
    size?: string[];
}) {
    return (
        <>
            <Box
                backdropBlur={10}
                backdropFilter="blur(10px)"
                backgroundColor={"whiteAlpha.200"}
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
