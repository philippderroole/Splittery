"use client";

import { Box, useColorModeValue } from "@chakra-ui/react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function IconText({
    width,
    height,
}: {
    width: number;
    height: number;
}) {
    const router = useRouter();

    return (
        <Box>
            <Image
                src={useColorModeValue(
                    "icon-light-text.svg",
                    "icon-dark-text.svg"
                )}
                width={width}
                height={height}
                alt=""
                onClick={() => {
                    router.push("/");
                }}
                objectFit="cover"
            />
        </Box>
    );
}
