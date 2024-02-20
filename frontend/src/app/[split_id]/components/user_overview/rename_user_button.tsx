"use client";

import { revalidateTag } from "@/app/server_actions";
import { HttpService } from "@/services/HttpService";
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

export default function RenameUserButton({
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
                description: error,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
            console.error("Error renaming user", error);
        }
    }

    function validate_name(): string | undefined {
        if (name.length === 0 && touched) {
            return "Name is required";
        }

        for (let user of users) {
            if (user.name === name) {
                return "Name already exists";
            }
        }
    }

    const name_form = (
        <FormControl isRequired isInvalid={validate_name() != undefined}>
            <FormLabel>Name</FormLabel>
            <Input
                placeholder="Name"
                onFocus={() => setTouched(true)}
                onChange={(e) => setName(e.target.value)}
            />
            <FormErrorMessage>{validate_name()}</FormErrorMessage>
        </FormControl>
    );

    const modal = (
        <Modal isOpen={isOpen} onClose={onClose}>
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
