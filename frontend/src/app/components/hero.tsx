"use client";

import { HttpService } from "@/services/HttpService";
import { Button, HStack, Stack, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

export default function Hero() {
    const router = useRouter();

    return (
        <>
            <Stack>
                <Text fontWeight="600" fontSize="6xl">
                    <Text
                        as="span"
                        bgGradient="linear(to-l, #4F6F52, #9AE6B4)"
                        bgClip="text">
                        Split{" "}
                    </Text>
                    your finances <br />
                    with friends and family
                </Text>
                <Text fontSize="3xl" opacity="0.7">
                    Easily track shared expenses, split bills, and settle up
                    together.
                </Text>
                <HStack spacing={5} marginTop={8}>
                    <Button
                        paddingX={5}
                        paddingY={8}
                        colorScheme="green"
                        variant="solid"
                        size="lg"
                        width="fit-content"
                        onClick={() => {
                            HttpService.POST("/splits", {
                                name: "My new split",
                            }).then((response) => {
                                router.push("/" + response.id);
                            });
                        }}>
                        Create a split →
                    </Button>
                    <Button
                        paddingX={5}
                        paddingY={8}
                        colorScheme="white"
                        variant="outline"
                        size="lg"
                        width="fit-content">
                        Browse my splits
                    </Button>
                </HStack>
            </Stack>
        </>
    );
}
