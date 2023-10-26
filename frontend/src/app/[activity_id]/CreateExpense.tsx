"use client";

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
    Select,
} from "@chakra-ui/react";
import { useState } from "react";

export default function CreateExpense({ params, isOpen, onOpen, onClose }) {
    const users = [] as User[];
    const expenses = [] as Expense[];

    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState(0);
    const [user, setUser] = useState({} as User);

    function isTitleValid(title: string): boolean {
        return !isEmpty(title) && !isTooLong(title) && !isTitleTaken(title);
    }

    function isEmpty(username: string): boolean {
        return username.length === 0;
    }

    function isTooLong(username: string): boolean {
        return username.length > 32;
    }

    function isTitleTaken(title: string): boolean {
        return expenses.some((expense) => expense.title === title);
    }

    function isUserValid(user: User): boolean {
        return user.name !== undefined;
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalContent>
                <ModalHeader>Add Expense</ModalHeader>
                <ModalBody>
                    <FormControl isInvalid={!isTitleValid(title)}>
                        <FormLabel>Title</FormLabel>
                        <Input
                            type="text"
                            value={title}
                            onChange={(event) => setTitle(event.target.value)}
                        />
                        <FormErrorMessage>
                            {isEmpty(title)
                                ? "Title is empty"
                                : isTooLong(title)
                                ? "Title is too long"
                                : ""}
                        </FormErrorMessage>
                    </FormControl>
                    <FormControl paddingTop="1vb">
                        <FormLabel>Amount</FormLabel>
                        <Input
                            type="number"
                            value={amount}
                            onChange={(event) =>
                                setAmount(parseFloat(event.target.value))
                            }
                        />
                    </FormControl>
                    <FormControl
                        paddingTop="1vb"
                        isInvalid={!isUserValid(user)}>
                        <FormLabel>Who paid?</FormLabel>
                        <Select
                            placeholder="Select user"
                            onChange={(event) =>
                                setUser(
                                    users.find(
                                        (user) =>
                                            user.name === event.target.value
                                    )!
                                )
                            }>
                            {users.map((user) => (
                                <option key={user.name}>{user.name}</option>
                            ))}
                        </Select>
                    </FormControl>
                </ModalBody>
                <ModalFooter>
                    <Button variant="ghost" onClick={() => onClose()}>
                        Cancel
                    </Button>

                    <Button
                        colorScheme="blue"
                        mr={3}
                        onClick={() => {
                            if (!isTitleValid(title) || !isUserValid(user)) {
                                return;
                            }

                            setTitle("");
                            setAmount(0);
                            setUser({} as User);
                            onClose();
                        }}>
                        Add
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
