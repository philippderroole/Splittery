"use client";

import {
    Button,
    Center,
    Flex,
    Heading,
    Stack,
    useColorModeValue,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";

export default function NotFoundPage() {
    const router = useRouter();

    return (
        <Center flexGrow={1} paddingBottom={20}>
            <Stack>
                <Heading padding={8} fontSize={60}>
                    404 - Page Not Found
                </Heading>
                <Flex direction="row" justifyContent="center">
                    <Button
                        colorScheme={useColorModeValue(
                            "light.primary",
                            "dark.primary"
                        )}
                        width="fit-content"
                        onClick={() => {
                            router.push("/");
                        }}>
                        Go Home
                    </Button>
                </Flex>
            </Stack>
        </Center>
    );
}
