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
import React, { useEffect } from "react";
import {
    validate_amount,
    validate_name,
    validate_payer,
    validate_receiver,
} from "../../../../services/Validation";

export default function CreateTransactionButton({
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
    const [receiverId, setReceiverId] = React.useState(
        users[1]?.id || users[0]?.id
    );

    useEffect(() => {
        setPayerId(users[0]?.id);
        setReceiverId(users[1]?.id || users[0]?.id);
    }, [users]);

    function close() {
        setNameTouched(false);
        setAmountTouched(false);
        onClose();
    }

    async function handleCreateTransfer() {
        if (validate_receiver(tabIndex, payerId, receiverId) != undefined) {
            return;
        }
        if (validate_payer(tabIndex, payerId) != undefined) {
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
            close();
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
        if (validate_payer(tabIndex, payerId) != undefined) {
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
            close();
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
        if (validate_receiver(tabIndex, payerId, receiverId) != undefined) {
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
            close();
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
        setNameTouched(true);
        setAmountTouched(true);

        if (validate_name(name) != undefined) {
            return;
        }
        if (validate_amount(amount) != undefined) {
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

    const createTransactionButton = (
        <IconButton
            colorScheme="green"
            borderRadius="full"
            icon={<AddIcon />}
            aria-label={"add transaction"}
            onClick={() => {
                if (users.length === 0) {
                    toast({
                        title: "Can't create transaction",
                        description: "Please create a user first",
                        status: "error",
                        duration: 5000,
                        isClosable: true,
                    });
                } else {
                    onOpen();
                }
            }}></IconButton>
    );

    const name_form = (
        <FormControl
            paddingY={2}
            isRequired
            isInvalid={validate_name(name) != undefined && nameTouched}>
            <FormLabel>Name</FormLabel>
            <Input
                key="name"
                placeholder="Name"
                onChange={(e) => {
                    setName(e.target.value);
                    setNameTouched(true);
                }}
            />
            <FormErrorMessage>{validate_name(name)}</FormErrorMessage>
        </FormControl>
    );

    const amount_form = (
        <FormControl
            paddingY={2}
            isRequired
            isInvalid={validate_amount(amount) != undefined && amountTouched}>
            <FormLabel>Amount</FormLabel>
            <Input
                key="amount"
                placeholder="Amount"
                onChange={(e) => {
                    setAmount(parseFloat(e.target.value));
                    setAmountTouched(true);
                }}
            />
            <FormErrorMessage>{validate_amount(amount)}</FormErrorMessage>
        </FormControl>
    );

    const payer_form = (
        <FormControl
            paddingY={2}
            isRequired
            isInvalid={validate_payer(tabIndex, payerId) != undefined}>
            <FormLabel>Payer</FormLabel>
            <Select
                defaultValue={payerId}
                onChange={(e) => {
                    setPayerId(parseInt(e.target.value));
                }}>
                <>
                    {users.map((user) => (
                        <option key={user.id} value={user.id}>
                            {user.name}
                        </option>
                    ))}
                </>
            </Select>
            <FormErrorMessage>
                {validate_payer(tabIndex, payerId)}
            </FormErrorMessage>
        </FormControl>
    );

    const receiver_form = (
        <FormControl
            paddingY={2}
            isRequired
            isInvalid={
                validate_receiver(tabIndex, payerId, receiverId) != undefined
            }>
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
            <FormErrorMessage>
                {validate_receiver(tabIndex, payerId, receiverId)}
            </FormErrorMessage>
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

    const transfer_form = (
        <>
            {name_form}
            {amount_form}
            {payer_form}
            {receiver_form}
        </>
    );

    const transaction_modal = (
        <Modal isOpen={isOpen} onClose={close}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Create a new transaction</ModalHeader>
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
                            <TabPanel>{expense_form}</TabPanel>
                            <TabPanel>{income_form}</TabPanel>
                            <TabPanel>{transfer_form}</TabPanel>
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
                    <Button onClick={close}>Cancel</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );

    return (
        <>
            {createTransactionButton}
            {transaction_modal}
        </>
    );
}
