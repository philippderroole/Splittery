"use client";

import { CopyIcon } from "@chakra-ui/icons";
import {
    Flex,
    IconButton,
    Input,
    InputGroup,
    InputRightElement,
    useClipboard,
    useToast,
} from "@chakra-ui/react";
import { useParams } from "next/navigation";

export default function CopyUrl() {
    const { onCopy, value, setValue, hasCopied } = useClipboard("");
    const toast = useToast();
    const params = useParams();

    function copyUrl() {
        toast({
            title: "Copied URL to clipboard.",
            status: "success",
            duration: 2000,
            isClosable: true,
            position: "bottom",
        });

        onCopy();
    }

    const url = window.location.href;

    return (
        <>
            <Flex direction="row" position="fixed" top="2.37vb" left="4.3vb">
                <InputGroup>
                    <Input
                        value={url}
                        fontSize="sm"
                        width="33vb"
                        variant="filled"
                        isReadOnly
                    />
                    <InputRightElement>
                        <IconButton
                            size="sm"
                            aria-label={"copy url to clipboard"}
                            onClick={copyUrl}
                            colorScheme="green"
                            icon={<CopyIcon />}></IconButton>
                    </InputRightElement>
                </InputGroup>
            </Flex>
        </>
    );
}
