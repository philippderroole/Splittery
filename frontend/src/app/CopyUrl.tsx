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
import { CSSProperties, useEffect, useState } from "react";

export default function CopyUrl(props?: CSSProperties) {
    const { onCopy, value, setValue, hasCopied } = useClipboard("");

    const toast = useToast();
    const params = useParams();

    const [url, setUrl] = useState("");

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

    useEffect(() => {
        if (params.activity_id === undefined) return;

        setUrl(window?.location.href);
    });

    return (
        <>
            <Flex
                direction="row"
                style={props}
                width="fit-content"
                hidden={params.activity_id === undefined}>
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
