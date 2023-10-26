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
    Select,
    useDisclosure,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateExpense({ params, users }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const router = useRouter();

    const activity: Activity = {
        id: Array.isArray(params.activity_id)
            ? params.activity_id[0]
            : params.activity_id,
    };

    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState(0);
    const [user, setUser] = useState({} as User);

    function isTitleValid(title: string): boolean {
        return !isEmpty(title) && !isTooLong(title);
    }

    function isEmpty(username: string): boolean {
        return username.length === 0;
    }

    function isTooLong(username: string): boolean {
        return username.length > 32;
    }

    function isUserValid(user: User): boolean {
        return user.name !== undefined;
    }

    const create = async () => {
        if (!isTitleValid(title) || !isUserValid(user)) {
            return;
        }

        let amount_per_user = amount / users.length;

        let balances: Balance[] = users.map((u) => {
            let balance: Balance = {
                user: u,
                amount: -amount_per_user,
                is_selected: true,
                share: 1,
            };

            if (user.name === u.name) {
                balance.amount = amount - amount_per_user;
            }

            return balance;
        });

        let expense: Expense = {
            id: "",
            activity: activity,
            name: title,
            amount: amount,
            user: user,
            balances: balances,
        };

        HttpService.POST("/expense/create", expense)
            .then(() => {
                setTitle("");
                setAmount(0);
                onClose();
                router.refresh();
            })
            .catch(() => {});
    };

    return (
        <>
            <Button onClick={() => onOpen()}>Add Expense</Button>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalContent>
                    <ModalHeader>Add Expense</ModalHeader>
                    <ModalBody>
                        <FormControl isInvalid={!isTitleValid(title)}>
                            <FormLabel>Title</FormLabel>
                            <Input
                                type="text"
                                value={title}
                                onChange={(event) =>
                                    setTitle(event.target.value)
                                }
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
                            onClick={() => create()}>
                            Add
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}
