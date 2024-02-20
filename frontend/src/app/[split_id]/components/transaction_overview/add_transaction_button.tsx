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
    Select,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    useDisclosure,
    useToast,
} from "@chakra-ui/react";
import React from "react";

export default function AddTransactionButton({
    split_id,
    users,
}: {
    split_id: number;
    users: any[];
}) {
    const toast = useToast();

    const { isOpen, onOpen, onClose } = useDisclosure();

    const [tabIndex, setTabIndex] = React.useState(0);

    const [name, setName] = React.useState("");
    const [nameTouched, setNameTouched] = React.useState(false);

    const [amount, setAmount] = React.useState(0);
    const [amountTouched, setAmountTouched] = React.useState(false);

    const [payerId, setPayerId] = React.useState(users[0]?.id);
    const [receiverId, setReceiverId] = React.useState(users[0]?.id);

    function validate_name(): string | undefined {
        if (name.length === 0 && nameTouched) {
            return "Name is required";
        }
    }

    function validate_amount(): string | undefined {
        if (amount === 0 && amountTouched) {
            return "Amount is required";
        }

        if (amount < 0) {
            return "Amount can't be negative";
        }

        if (isNaN(amount)) {
            return "Amount must be a number";
        }
    }

    function validate_payer(): string | undefined {
        if (tabIndex === 1) {
            return;
        }

        if (payerId === undefined) {
            return "Payer is required";
        }
    }

    function validate_receiver(): string | undefined {
        if (tabIndex === 1) {
            return;
        }

        if (receiverId === undefined) {
            return "Receiver is required";
        }

        if (tabIndex === 2 && payerId === receiverId) {
            return "Payer and receiver can't be the same";
        }
    }

    async function handleCreateTransfer() {
        if (validate_receiver() != undefined) {
            return;
        }
        if (validate_payer() != undefined) {
            return;
        }

        try {
            let new_transaction1 = {
                split_id: split_id,
                name: name,
                amount: -amount,
                user_id: users.find((user) => user.id === payerId).id,
            };

            const response1 = await HttpService.POST(
                `/splits/${split_id}/transactions`,
                new_transaction1
            );

            let new_transaction2 = {
                split_id: split_id,
                name: name,
                amount: amount,
                user_id: users.find((user) => user.id === receiverId).id,
            };

            const response2 = await HttpService.POST(
                `/splits/${split_id}/transactions`,
                new_transaction2
            );

            revalidateTag("transactions");
            onClose();
        } catch (error) {
            toast({
                title: "Unexpected error occurred while creating transaction",
                description: error,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
            console.error("Error creating transaction", error);
        }
    }

    async function handleCreateExpense() {
        if (validate_payer() != undefined) {
            return;
        }

        try {
            let new_transaction = {
                split_id: split_id,
                name: name,
                amount: -amount,
                user_id: users.find((user) => user.id === payerId).id,
            };

            const response = await HttpService.POST(
                `/splits/${split_id}/transactions`,
                new_transaction
            );

            revalidateTag("transactions");
            onClose();
        } catch (error) {
            toast({
                title: "Unexpected error occurred while creating transaction",
                description: error,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
            console.error("Error creating transaction", error);
        }
    }

    async function handleCreateIncome() {
        if (validate_receiver() != undefined) {
            return;
        }

        try {
            let new_transaction = {
                split_id: split_id,
                name: name,
                amount: amount,
                user_id: users.find((user) => user.id === payerId).id,
            };

            const response = await HttpService.POST(
                `/splits/${split_id}/transactions`,
                new_transaction
            );

            revalidateTag("transactions");
            onClose();
        } catch (error) {
            toast({
                title: "Unexpected error occurred while creating transaction",
                description: error,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
            console.error("Error creating transaction", error);
        }
    }

    async function handleCreateTransaction() {
        if (validate_name() != undefined) {
            return;
        }
        if (validate_amount() != undefined) {
            return;
        }

        switch (tabIndex) {
            case 0:
                await handleCreateExpense();
                break;
            case 1:
                await handleCreateIncome();
                break;
            case 2:
                await handleCreateTransfer();
                break;
        }
    }

    function AddTransactionButton() {
        return (
            <IconButton
                colorScheme="green"
                borderRadius="full"
                icon={<AddIcon />}
                aria-label={"add transaction"}
                onClick={onOpen}></IconButton>
        );
    }

    const name_form = () => {
        return (
            <FormControl
                paddingY={2}
                isRequired
                isInvalid={validate_name() != undefined}>
                <FormLabel>Name</FormLabel>
                <Input
                    key="name"
                    placeholder="Name"
                    onFocus={() => setNameTouched(true)}
                    onChange={(e) => setName(e.target.value)}
                />
                <FormErrorMessage>{validate_name()}</FormErrorMessage>
            </FormControl>
        );
    };

    const amount_form = () => {
        return (
            <FormControl
                paddingY={2}
                isRequired
                isInvalid={validate_amount() != undefined}>
                <FormLabel>Amount</FormLabel>
                <Input
                    key="amount"
                    placeholder="Amount"
                    onFocus={() => setAmountTouched(true)}
                    onChange={(e) => setAmount(parseFloat(e.target.value))}
                />
                <FormErrorMessage>{validate_amount()}</FormErrorMessage>
            </FormControl>
        );
    };

    const payer_form = () => {
        return (
            <FormControl
                paddingY={2}
                isRequired
                isInvalid={validate_payer() != undefined}>
                <FormLabel>Payer</FormLabel>
                <Select
                    defaultValue={payerId}
                    onChange={(e) => {
                        setPayerId(parseInt(e.target.value));
                    }}>
                    {users.map((user) => (
                        <option key={user.id} value={user.id}>
                            {user.name}
                        </option>
                    ))}
                </Select>
            </FormControl>
        );
    };

    const receiver_form = () => {
        return (
            <FormControl
                paddingY={2}
                isRequired
                isInvalid={validate_receiver() != undefined}>
                <FormLabel>Receiver</FormLabel>
                <Select
                    defaultValue={receiverId}
                    onChange={(e) => setReceiverId(parseInt(e.target.value))}>
                    {users.map((user) => (
                        <option key={user.id} value={user.id}>
                            {user.name}
                        </option>
                    ))}
                </Select>
                <FormErrorMessage>{validate_receiver()}</FormErrorMessage>
            </FormControl>
        );
    };

    const expense_form = () => {
        return (
            <>
                {name_form()}
                {amount_form()}
                {payer_form()}
            </>
        );
    };

    const income_form = () => {
        return (
            <>
                {name_form()}
                {amount_form()}
                {receiver_form()}
            </>
        );
    };

    const transfer_form = () => {
        return (
            <>
                {name_form()}
                {amount_form()}
                {payer_form()}
                {receiver_form()}
            </>
        );
    };

    const transaction_modal = () => {
        return (
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Add a new transaction</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <Tabs
                            onChange={(index) => setTabIndex(index)}
                            index={tabIndex}>
                            <TabList>
                                <Tab>Expense</Tab>
                                <Tab>Income</Tab>
                                <Tab>Transfer</Tab>
                            </TabList>

                            <TabPanels>
                                <TabPanel>{expense_form()}</TabPanel>
                                <TabPanel>{income_form()}</TabPanel>
                                <TabPanel>{transfer_form()}</TabPanel>
                            </TabPanels>
                        </Tabs>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            colorScheme="green"
                            mr={3}
                            onClick={handleCreateTransaction}>
                            Save
                        </Button>
                        <Button onClick={onClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        );
    };

    return (
        <>
            <AddTransactionButton />
            {transaction_modal()}
        </>
    );
}
