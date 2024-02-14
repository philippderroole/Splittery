"use server";

import { Box, Heading } from "@chakra-ui/react";

export default async function LayoutBox({
    name,
    children,
}: {
    name: string;
    children?: React.ReactNode;
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
                width="fit-content">
                <Heading size="md" paddingTop={2} marginBottom={3}>
                    {name}
                </Heading>
                {children}
            </Box>
        </>
    );
}
