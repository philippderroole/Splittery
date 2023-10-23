import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { IconButton, useColorMode } from "@chakra-ui/react";

export const DarkModeSwitch = () => {
    const { colorMode, toggleColorMode } = useColorMode();
    const isDark = colorMode === "dark";
    return (
        <IconButton
            position="fixed"
            top="2.37vb"
            right="5.4vb"
            icon={isDark ? <SunIcon /> : <MoonIcon />}
            aria-label="Toggle Theme"
            colorScheme="green"
            onClick={toggleColorMode}
        />
    );
};
