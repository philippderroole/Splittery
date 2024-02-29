"use client";

import { InfoIcon } from "@chakra-ui/icons";
import {
    IconButton,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverContent,
    PopoverTrigger,
    Text,
} from "@chakra-ui/react";

export default function TooltipMobile({ text }: { text: string }) {
    return (
        <>
            <Popover>
                <PopoverTrigger>
                    <IconButton
                        aria-label={""}
                        variant="ghost"
                        margin={0}
                        icon={<InfoIcon margin={1} paddingBottom={0.5} />}
                    />
                </PopoverTrigger>
                <PopoverContent>
                    <PopoverArrow />
                    <PopoverBody>
                        <Text whiteSpace={"pre-line"}>{text} </Text>
                    </PopoverBody>
                </PopoverContent>
            </Popover>
        </>
    );
}
