"use server";

import { Box } from "@chakra-ui/react";

export default async function LayoutBox({
    children,
}: {
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
                {children}
            </Box>
        </>
    );
}
