"use client";

import { HttpService } from "@/services/HttpService";
import { Button, Stack, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

export default function Hero(props) {
    const { padding, ...rest } = props;

    const router = useRouter();

    const heading = (
        <Text
            fontWeight="1000"
            fontSize={["3xl", "4xl", "5xl", null, "6xl", "7xl"]}>
            <Text
                as="span"
                backgroundColor={"green.500"}
                bgGradient="linear(to-r, green.200, green.500)"
                bgClip="text">
                Split{" "}
            </Text>
            your finances <br />
            with friends and family
        </Text>
    );

    const subHeading = (
        <Text fontSize={["lg", "xl", "2xl", null, "3xl", "4xl"]} opacity="0.7">
            Easily track shared expenses, split bills, and settle up together.
        </Text>
    );

    const buttonGroup = () => {
        const paddingX = { lg: 5, xl: 6 };
        const paddingY = { lg: 6, xl: 8 };
        const fontSize = ["md", "lg", null, null, "xl"];
        const width = { base: 200, sm: 250, md: 200 };
        const height = { base: 50, sm: 50, md: 61, lg: 70 };

        return (
            <Stack
                direction={{ base: "column", md: "row" }}
                alignItems={{ base: "center", md: "start" }}
                spacing={5}
                marginTop={8}>
                <Button
                    paddingX={paddingX}
                    paddingY={paddingY}
                    fontSize={fontSize}
                    width={width}
                    height={height}
                    colorScheme="green"
                    variant="solid"
                    onClick={() => {
                        HttpService.POST("/splits", {
                            name: "My new split",
                        }).then((split) => {
                            router.push("/" + split.id);
                        });
                    }}>
                    Create a split →
                </Button>
                <Button
                    paddingX={paddingX}
                    paddingY={paddingY}
                    fontSize={fontSize}
                    width={width}
                    height={height}
                    colorScheme="white"
                    variant="outline">
                    Browse my splits
                </Button>
            </Stack>
        );
    };

    return (
        <Stack __css={props}>
            {heading}
            {subHeading}
            {buttonGroup()}
        </Stack>
    );
}
