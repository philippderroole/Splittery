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
    useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CreateUser({ params }) {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const router = useRouter();
    const toast = useToast();

    const activity: Activity = {
        id: Array.isArray(params.activity_id)
            ? params.activity_id[0]
            : params.activity_id,
    };

    const [username, setUsername] = useState("");
    const [isUsernameValid, setIsUsernameValid] = useState<Validity>({
        message: "Username is empty.",
    } as Validity);

    useEffect(() => {
        if (username.length === 0 || username === undefined) {
            setIsUsernameValid({
                valid: false,
                message: "Username is empty.",
            });
            return;
        }
        if (username.length > 32) {
            setIsUsernameValid({
                valid: false,
                message: "Username is too long. (max 32 characters)",
            });
            return;
        }

        setIsUsernameValid({
            valid: true,
            message: "",
        });
    }, [username]);

    const create = async () => {
        if (!isUsernameValid.valid) {
            return;
        }

        let user: User = {
            name: username,
            activity: activity,
        };

        let result = HttpService.POST("/user/create", user);

        result
            .then(() => {
                toast({
                    title: "User created.",
                    description: `${username} was created successfully.`,
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                });

                setUsername("");
                onClose();
                router.refresh();
            })
            .catch(() => {
                setIsUsernameValid({
                    valid: false,
                    message: "Username is already taken.",
                });

                toast({
                    title: "Failed to create user.",
                    description: `User ${username} was not created.`,
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                });
            });
    };

    return (
        <>
            <Button onClick={() => onOpen()}>Add User</Button>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalContent>
                    <ModalHeader>Add User</ModalHeader>
                    <ModalBody>
                        <form
                            onSubmit={(event) => {
                                event.preventDefault();
                                create();
                            }}>
                            <FormControl isInvalid={!isUsernameValid.valid}>
                                <FormLabel>Username</FormLabel>
                                <Input
                                    type="text"
                                    value={username}
                                    onChange={(event) =>
                                        setUsername(event.target.value)
                                    }
                                />
                                <FormErrorMessage>
                                    {isUsernameValid.message}
                                </FormErrorMessage>
                            </FormControl>
                        </form>
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
        </>
    );
}
