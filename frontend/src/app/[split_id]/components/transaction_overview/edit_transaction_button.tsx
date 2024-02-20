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

export default function RenameTransactionButton({
    split_id,
    transaction,
    users,
}: {
    split_id: number;
    transaction: any;
    users: any[];
}) {
    const toast = useToast();

    const { isOpen, onOpen, onClose } = useDisclosure();

    const [tabIndex, setTabIndex] = React.useState(
        transaction.amount < 0 ? 0 : 1
    );

    const [name, setName] = React.useState(transaction.name);
    const [nameTouched, setNameTouched] = React.useState(false);

    const [amount, setAmount] = React.useState(Math.abs(transaction.amount));
    const [amountTouched, setAmountTouched] = React.useState(false);

    const [payerId, setPayerId] = React.useState(transaction.user_id);
    const [receiverId, setReceiverId] = React.useState(transaction.user_id);

    async function handleEditExpense() {
        if (validate_payer() != undefined) {
            return;
        }

        try {
            let new_transaction = {
                name: name,
                amount: -amount,
                user_id: payerId,
            };

            const response = await HttpService.PUT(
                `/splits/${split_id}/transactions/${transaction.id}`,
                new_transaction
            );

            revalidateTag("users");
            revalidateTag("transactions");
            onClose();
        } catch (error) {
            toast({
                title: "Unexpected error occurred while renaming transaction",
                description: error,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
            console.error("Error renaming transaction", error);
        }
    }

    async function handleEditIncome() {
        if (validate_receiver() != undefined) {
            return;
        }

        try {
            let new_transaction = {
                name: name,
                amount: amount,
                user_id: receiverId,
            };

            const response = await HttpService.PUT(
                `/splits/${split_id}/transactions/${transaction.id}`,
                new_transaction
            );

            revalidateTag("users");
            revalidateTag("transactions");
            onClose();
        } catch (error) {
            toast({
                title: "Unexpected error occurred while renaming transaction",
                description: error,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
            console.error("Error renaming transaction", error);
        }
    }

    async function handleEditTransaction() {
        if (validate_name() != undefined) {
            return;
        }
        if (validate_amount() != undefined) {
            return;
        }

        switch (tabIndex) {
            case 0:
                await handleEditExpense();
                break;
            case 1:
                await handleEditIncome();
                break;
        }
    }

    function validate_name(): string | undefined {
        if (name.length === 0 && nameTouched) {
            return "Name is required";
        }

        for (let user of users) {
            if (user.name === name) {
                return "Name already exists";
            }
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
        if (receiverId === undefined) {
            return "Receiver is required";
        }

        if (tabIndex === 2 && payerId === receiverId) {
            return "Payer and receiver can't be the same";
        }
    }

    const name_form = (
        <FormControl
            paddingY={2}
            isRequired
            isInvalid={validate_name() != undefined}>
            <FormLabel>Name</FormLabel>
            <Input
                defaultValue={name}
                key="name"
                placeholder="Name"
                onFocus={() => setNameTouched(true)}
                onChange={(e) => setName(e.target.value)}
            />
            <FormErrorMessage>{validate_name()}</FormErrorMessage>
        </FormControl>
    );

    const amount_form = (
        <FormControl
            paddingY={2}
            isRequired
            isInvalid={validate_amount() != undefined}>
            <FormLabel>Amount</FormLabel>
            <Input
                defaultValue={amount}
                key="amount"
                placeholder="Amount"
                onFocus={() => setAmountTouched(true)}
                onChange={(e) => setAmount(parseFloat(e.target.value))}
            />
            <FormErrorMessage>{validate_amount()}</FormErrorMessage>
        </FormControl>
    );

    const payer_form = (
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

    const receiver_form = (
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

    const expense_form = (
        <>
            {name_form}
            {amount_form}
            {payer_form}
        </>
    );

    const income_form = (
        <>
            {name_form}
            {amount_form}
            {receiver_form}
        </>
    );

    const modal = (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Edit {transaction.name}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Tabs
                        onChange={(index) => setTabIndex(index)}
                        index={tabIndex}>
                        <TabList>
                            <Tab>Expense</Tab>
                            <Tab>Income</Tab>
                        </TabList>

                        <TabPanels>
                            <TabPanel>{expense_form}</TabPanel>
                            <TabPanel>{income_form}</TabPanel>
                        </TabPanels>
                    </Tabs>
                </ModalBody>
                <ModalFooter>
                    <Button
                        colorScheme="green"
                        mr={3}
                        onClick={handleEditTransaction}>
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
