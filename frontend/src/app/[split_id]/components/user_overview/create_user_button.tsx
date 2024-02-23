"use client";

import { revalidateTag } from "@/app/server_actions";
import { HttpService } from "@/services/HttpService";
import { validate_name } from "@/services/Validation";
import { AddIcon } from "@chakra-ui/icons";
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

export default function CreateUserButton({
    split_id,
    users,
}: {
    split_id: number;
    users: any[];
}) {
    const toast = useToast();

    const { isOpen, onOpen, onClose } = useDisclosure();
    const initialRef = React.useRef(null);

    const [name, setName] = React.useState("");
    const [touched, setTouched] = React.useState(false);

    function close() {
        setTouched(false);
        onClose();
    }

    async function handleCreateUser() {
        setTouched(true);

        if (validate_name(name) != undefined) {
            return;
        }

        try {
            let new_user = {
                split_id: split_id,
                name: name,
            };

            const response = await HttpService.POST(
                `/splits/${split_id}/users`,
                new_user
            );

            revalidateTag("users");
            close();
        } catch (error) {
            toast({
                title: "Unexpected error occurred while creating user",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
            console.error("Error creating user", error);
        }
    }

    const button = (
        <IconButton
            colorScheme="green"
            borderRadius="full"
            icon={<AddIcon />}
            aria-label={"add user"}
            onClick={onOpen}></IconButton>
    );

    const name_form = (
        <FormControl
            isRequired
            isInvalid={validate_name(name) != undefined && touched}>
            <FormLabel>Name</FormLabel>
            <Input
                ref={initialRef}
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
        <Modal isOpen={isOpen} onClose={close} size={["sm", "md"]}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Create a new user</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>{name_form}</ModalBody>
                <ModalFooter>
                    <Button
                        colorScheme="green"
                        mr={3}
                        onClick={handleCreateUser}>
                        Save
                    </Button>
                    <Button onClick={close}>Cancel</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );

    return (
        <>
            {button}
            {modal}
        </>
    );
}
