"use client";

import { revalidateTag } from "@/app/server_actions";
import { HttpService } from "@/services/HttpService";
import { CheckIcon, CloseIcon, EditIcon } from "@chakra-ui/icons";
import {
    ButtonGroup,
    Editable,
    EditableInput,
    EditablePreview,
    Flex,
    HStack,
    IconButton,
    useEditableControls,
    useToast,
} from "@chakra-ui/react";
import React from "react";

export default function SplitName({ split }: { split: any }) {
    const toast = useToast();

    const [name, setName] = React.useState(split.name);

    async function handleRenameSplit() {
        try {
            let new_split = {
                name: name,
            };

            const response = await HttpService.PUT(
                `/splits/${split.id}`,
                new_split
            );

            revalidateTag("split");
        } catch (error) {
            toast({
                title: "Unexpected error occurred while renaming split",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
            console.error("Error renaming user", error);
        }
    }

    function EditableControls() {
        const {
            isEditing,
            getSubmitButtonProps,
            getCancelButtonProps,
            getEditButtonProps,
        } = useEditableControls();

        return isEditing ? (
            <ButtonGroup justifyContent="center" size="sm">
                <IconButton
                    aria-label="submit"
                    icon={<CheckIcon />}
                    {...getSubmitButtonProps()}
                />
                <IconButton
                    aria-label="cancel"
                    icon={<CloseIcon />}
                    {...getCancelButtonProps()}
                />
            </ButtonGroup>
        ) : (
            <Flex direction="row">
                <IconButton
                    aria-label="edit split name"
                    size="sm"
                    icon={<EditIcon />}
                    variant="ghost"
                    {...getEditButtonProps()}
                />
            </Flex>
        );
    }

    return (
        <>
            <Editable
                textAlign="left"
                defaultValue={split.name}
                fontSize="3xl"
                fontWeight="bold"
                isPreviewFocusable={false}
                onChange={(e) => setName(e)}
                onSubmit={handleRenameSplit}
                submitOnBlur={false}>
                <HStack>
                    <EditablePreview />
                    <EditableInput width={"fit-content"} />
                    <EditableControls />
                </HStack>
            </Editable>
        </>
    );
}
