"use client";

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
} from "@chakra-ui/react";
import React from "react";

export default function RenameUserButton({
    user,
    users,
}: {
    user: any;
    users: any[];
}) {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [name, setName] = React.useState("");
    const [touched, setTouched] = React.useState(false);

    function handleRenameUser() {
        console.log("rename user");

        onClose();
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
