"use client";

import { revalidateTag } from "@/app/server_actions";
import { HttpService } from "@/services/HttpService";
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
} from "@chakra-ui/react";
import React from "react";

export default function AddUserButton({
    split_id,
    users,
}: {
    split_id: number;
    users: any[];
}) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const initialRef = React.useRef(null);

    const [name, setName] = React.useState("");
    const [touched, setTouched] = React.useState(false);

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

    const handleCreateUser = async () => {
        if (validate_name() != undefined) {
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
            onClose();
        } catch (error) {
            console.error("Error creating user", error);
        }
    };

    const button = (
        <IconButton
            colorScheme="green"
            borderRadius="full"
            icon={<AddIcon />}
            aria-label={"add user"}
            onClick={onOpen}></IconButton>
    );

    const name_form = (
        <FormControl isRequired isInvalid={validate_name() != undefined}>
            <FormLabel>Name</FormLabel>
            <Input
                ref={initialRef}
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
                <ModalHeader>Add a new user</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>{name_form}</ModalBody>
                <ModalFooter>
                    <Button
                        colorScheme="green"
                        mr={3}
                        onClick={handleCreateUser}>
                        Save
                    </Button>
                    <Button onClick={onClose}>Cancel</Button>
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
