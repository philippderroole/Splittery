"use client";

import { useColorMode } from "@chakra-ui/react";
import Image from "next/image";

export default function Logo(props) {
    const { colorMode, toggleColorMode } = useColorMode();

    return colorMode === "light" ? (
        <Image src={"icon-light-text.svg"} width={160} height={50} alt="" />
    ) : (
        <Image src={"icon-dark-text.svg"} width={160} height={50} alt="" />
    );
}
