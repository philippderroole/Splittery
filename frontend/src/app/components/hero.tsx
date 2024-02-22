"use client";

import { HttpService } from "@/services/HttpService";
import {
    Button,
    Flex,
    HStack,
    Hide,
    Show,
    Stack,
    Text,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";

export default function Hero() {
    const router = useRouter();

    const button_width = ["2xs", "3xs"];

    const heading = (
        <Text fontWeight="600" fontSize={["3xl", "4xl", "5xl", "6xl"]}>
            <Text
                as="span"
                bgGradient="linear(to-l, #4F6F52, #9AE6B4)"
                bgClip="text">
                Split{" "}
            </Text>
            your finances <br />
            with friends and family
        </Text>
    );

    const subHeading = (
        <Text fontSize={["lg", null, "2xl", "3xl"]} opacity="0.7">
            Easily track shared expenses, split bills, and settle up together.
        </Text>
    );

    const createSplitButton = (
        <Button
            paddingX={5}
            paddingY={[6, 8]}
            colorScheme="green"
            variant="solid"
            size={["md", "lg"]}
            width={button_width}
            onClick={() => {
                HttpService.POST("/splits", {
                    name: "My new split",
                }).then((split) => {
                    router.push("/" + split.id);
                });
            }}>
            Create a split →
        </Button>
    );

    const browseSplitsButton = (
        <Button
            paddingX={5}
            paddingY={[6, 8]}
            colorScheme="white"
            variant="outline"
            size={["md", "lg"]}
            width={button_width}>
            Browse my splits
        </Button>
    );

    const buttonGroup = (
        <>
            <Show above="sm">
                <HStack marginTop={8}>
                    {createSplitButton}
                    {browseSplitsButton}
                </HStack>
            </Show>
            <Hide above="sm">
                <Flex direction="column" align="center">
                    <Stack spacing={5} marginTop={8}>
                        {createSplitButton}
                        {browseSplitsButton}
                    </Stack>
                </Flex>
            </Hide>
        </>
    );

    return (
        <Stack padding={10}>
            {heading}
            {subHeading}
            {buttonGroup}
        </Stack>
    );
}
