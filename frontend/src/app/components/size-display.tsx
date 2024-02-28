import { Box, Hide, Show, Text } from "@chakra-ui/react";

export default function SizeDisplay() {
    return (
        <>
            <Box position={"fixed"} top={0} left={0} zIndex={1000} padding={2}>
                <Show above="base">
                    <Hide above="sm">
                        <Text>base</Text>
                    </Hide>
                </Show>
                <Show above="sm">
                    <Hide above="md">
                        <Text>sm</Text>
                    </Hide>
                </Show>
                <Show above="md">
                    <Hide above="lg">
                        <Text>md</Text>
                    </Hide>
                </Show>
                <Show above="lg">
                    <Hide above="xl">
                        <Text>lg</Text>
                    </Hide>
                </Show>
                <Show above="xl">
                    <Hide above="2xl">
                        <Text>xl</Text>
                    </Hide>
                </Show>
                <Show above="2xl">
                    <Text>2xl</Text>
                </Show>
            </Box>
        </>
    );
}
