"use client";

import { ActivityContext } from "@/lib/ActivityProvider";
import { UserService } from "@/services/UserService";
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
import { useContext, useEffect, useState } from "react";

export default function CreateUser() {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const activity_state = useContext(ActivityContext);
    const router = useRouter();
    const toast = useToast();

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
            id: "",
            name: username,
            activity_ids: [activity_state.activity.id],
            metadata: {
                created_at: "2023-11-02T22:45:48.558036Z",
                updated_at: "2023-11-02T22:45:48.558036Z",
                deleted_at: null,
            },
        };

        UserService.postUser(user)
            .then((user) => {
                toast({
                    title: "User created.",
                    description: `${username} was created successfully.`,
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                });

                activity_state.addUser(user);
                setUsername("");
                onClose();
                router.refresh();
            })
            .catch((error) => {
                setIsUsernameValid({
                    valid: false,
                    message: error.message,
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
