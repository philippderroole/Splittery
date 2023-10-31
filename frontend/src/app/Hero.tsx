"use client";

import { HttpService } from "@/services/HttpService";
import { Box, Button, Container, Heading, Stack, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

export default function Hero() {
    const router = useRouter();

    async function createActivity() {
        return await HttpService.POST("/activity/create");
    }

    return (
        <>
            <Container maxW={"4xl"}>
                <Stack
                    as={Box}
                    textAlign={"center"}
                    spacing={{ base: 8, md: 14 }}
                    py={{ base: 20, md: 36 }}>
                    <Heading
                        fontWeight={600}
                        fontSize={{ base: "2xl", sm: "4xl", md: "7xl" }}
                        lineHeight={"110%"}>
                        Split your expenses with <br />
                        <Text as={"span"} color={"green.400"}>
                            your family and friends
                        </Text>
                    </Heading>
                    <Stack
                        direction={"column"}
                        spacing={3}
                        align={"center"}
                        alignSelf={"center"}
                        position={"relative"}>
                        <Button
                            colorScheme={"green"}
                            bg={"green.400"}
                            rounded={"full"}
                            px={6}
                            _hover={{
                                bg: "green.500",
                            }}
                            onClick={() =>
                                createActivity().then((activity) => {
                                    router.push("/" + activity.id);
                                    router.refresh();
                                })
                            }>
                            Create activity
                        </Button>
                    </Stack>
                </Stack>
            </Container>
        </>
    );
}
