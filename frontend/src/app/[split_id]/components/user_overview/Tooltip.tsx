"use client";

import { InfoIcon } from "@chakra-ui/icons";
import { Tooltip as UiTooltip } from "@chakra-ui/react";

export default function Tooltip({ text }: { text: string }) {
    return (
        <UiTooltip hasArrow label={text}>
            <InfoIcon margin={1} paddingBottom={0.5} />
        </UiTooltip>
    );
}
