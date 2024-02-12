"use client";

import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { IconButton, useColorMode } from "@chakra-ui/react";
import { CSSProperties } from "react";

export const DarkModeSwitch = (props?: CSSProperties) => {
    const { colorMode, toggleColorMode } = useColorMode();
    const isDark = colorMode === "dark";
    return (
        <IconButton
            style={props}
            icon={isDark ? <SunIcon /> : <MoonIcon />}
            aria-label="Toggle Theme"
            colorScheme="green"
            onClick={toggleColorMode}
        />
    );
};
