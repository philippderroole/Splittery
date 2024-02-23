"use client";

import { revalidateTag } from "@/app/server_actions";
import { HttpService } from "@/services/HttpService";
import { validate_name } from "@/services/Validation";
import { EditIcon } from "@chakra-ui/icons";
import {
    Button,
    FormControl,
    FormErrorMessage,
    FormLabel,
    IconButton,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    useDisclosure,
    useToast,
} from "@chakra-ui/react";
import React from "react";

export default function EditUserButton({
    split_id,
    user,
    users,
}: {
    split_id: number;
    user: any;
    users: any[];
}) {
    const toast = useToast();

    const { isOpen, onOpen, onClose } = useDisclosure();

    const [name, setName] = React.useState("");
    const [touched, setTouched] = React.useState(false);

    async function handleRenameUser() {
        setTouched(true);

        if (validate_name(name) != undefined) {
            return;
        }

        try {
            let new_user = {
                name: name,
            };

            const response = await HttpService.PUT(
                `/splits/${split_id}/users/${user.id}`,
                new_user
            );

            revalidateTag("users");
            revalidateTag("transactions");
            onClose();
        } catch (error) {
            toast({
                title: "Unexpected error occurred while renaming user",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
            console.error("Error renaming user", error);
        }
    }

    const name_form = (
        <FormControl
            isRequired
            isInvalid={validate_name(name) != undefined && touched}>
            <FormLabel>Name</FormLabel>
            <Input
                placeholder="Name"
                onChange={(e) => {
                    setName(e.target.value);
                    setTouched(true);
                }}
            />
            <FormErrorMessage>{validate_name(name)}</FormErrorMessage>
        </FormControl>
    );

    const modal = (
        <Modal isOpen={isOpen} onClose={onClose} size={["sm", "md"]}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Rename {user.name}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>{name_form}</ModalBody>
                <ModalFooter>
                    <Button
                        colorScheme="green"
                        mr={3}
                        onClick={handleRenameUser}>
                        Save
                    </Button>
                    <Button variant="ghost" onClick={onClose}>
                        Cancel
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );

    return (
        <>
            <IconButton
                icon={<EditIcon></EditIcon>}
                aria-label="rename"
                variant="ghost"
                onClick={onOpen}></IconButton>

            {modal}
        </>
    );
}
