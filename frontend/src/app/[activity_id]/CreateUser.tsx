"use client";

import { HttpService } from "@/services/HttpService";
import {
    Button,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    useDisclosure,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateUser({ params }) {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const router = useRouter();

    const activity: Activity = {
        id: Array.isArray(params.activity_id)
            ? params.activity_id[0]
            : params.activity_id,
    };

    const balances = [] as Balance[];

    const [username, setUsername] = useState("");

    function isUsernameValid(username: string): boolean {
        return (
            !isUsernameTaken(username) &&
            !isEmpty(username) &&
            !isTooLong(username)
        );
    }

    function isUsernameTaken(username: string): boolean {
        return balances.some((expense) => expense.user.name === username);
    }

    function isEmpty(username: string): boolean {
        return username.length === 0;
    }

    function isTooLong(username: string): boolean {
        return username.length > 32;
    }

    const create = async () => {
        let user = {
            name: username,
            activity: activity,
        } as User;

        await HttpService.POST("/user/create", user);

        router.refresh();
        setUsername("");
        onClose();
    };

    return (
        <div>
            <Button
                onClick={() => {
                    onOpen();
                }}>
                Add User
            </Button>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalContent>
                    <ModalHeader>Add User</ModalHeader>
                    <ModalBody>
                        <FormControl isInvalid={!isUsernameValid(username)}>
                            <FormLabel>Username</FormLabel>
                            <Input
                                type="text"
                                value={username}
                                onChange={(event) =>
                                    setUsername(event.target.value)
                                }
                            />
                            <FormErrorMessage>
                                {isUsernameTaken(username)
                                    ? "Username is taken"
                                    : isEmpty(username)
                                    ? "Username is empty"
                                    : isTooLong(username)
                                    ? "Username is too long"
                                    : ""}
                            </FormErrorMessage>
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="ghost" onClick={() => onClose()}>
                            Cancel
                        </Button>
                        <Button
                            colorScheme="blue"
                            mr={3}
                            onClick={() => create()}>
                            Add
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
}
