"use client";

import { revalidateTag } from "@/app/server_actions";
import { Transaction } from "@/app/types/transaction";
import { CurrencyFormat } from "@/services/CurrencyFormat";
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
import {
    validate_amount,
    validate_name,
    validate_payer,
    validate_receiver,
} from "../../../../services/Validation";

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

    const [title, setTitle] = React.useState(transaction.title);
    const [titleTouched, setTitleTouched] = React.useState(false);

    const [amount, setAmount] = React.useState(Math.abs(transaction.amount));
    const [amountTouched, setAmountTouched] = React.useState(false);

    const [payerId, setPayerId] = React.useState(transaction.user_id);
    const [receiverId, setReceiverId] = React.useState(transaction.user_id);

    function close() {
        setTitleTouched(false);
        setAmountTouched(false);
        onClose();
    }

    async function handleEditExpense() {
        if (validate_payer(tabIndex, payerId) != undefined) {
            return;
        }

        try {
            let new_transaction: Transaction = {
                title: title,
                amount: -amount,
                user_id: payerId,
            };

            const response = await HttpService.PUT(
                `/splits/${split_id}/transactions/${transaction.id}`,
                new_transaction
            );

            revalidateTag("users");
            revalidateTag("transactions");
            close();
        } catch (error) {
            toast({
                title: "Unexpected error occurred while renaming transaction",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
            console.error("Error renaming transaction", error);
        }
    }

    async function handleEditIncome() {
        if (validate_receiver(tabIndex, payerId, receiverId) != undefined) {
            return;
        }

        try {
            let new_transaction: Transaction = {
                title: title,
                amount: amount,
                user_id: receiverId,
            };

            const response = await HttpService.PUT(
                `/splits/${split_id}/transactions/${transaction.id}`,
                new_transaction
            );

            revalidateTag("users");
            revalidateTag("transactions");
            close();
        } catch (error) {
            toast({
                title: "Unexpected error occurred while renaming transaction",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
            console.error("Error renaming transaction", error);
        }
    }

    async function handleEditTransaction() {
        setTitleTouched(true);
        setAmountTouched(true);

        if (validate_name(title) != undefined) {
            return;
        }
        if (validate_amount(amount) != undefined) {
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

    const name_form = (
        <FormControl
            paddingY={2}
            isRequired
            isInvalid={validate_name(title) != undefined && titleTouched}>
            <FormLabel>Title</FormLabel>
            <Input
                defaultValue={title}
                key="title"
                placeholder="Title"
                onFocus={() => setTitleTouched(true)}
                onChange={(e) => setTitle(e.target.value)}
            />
            <FormErrorMessage>{validate_name(title)}</FormErrorMessage>
        </FormControl>
    );

    const amount_form = (
        <FormControl
            paddingY={2}
            isRequired
            isInvalid={validate_amount(amount) != undefined && amountTouched}>
            <FormLabel>Amount</FormLabel>
            <Input
                defaultValue={CurrencyFormat.format(amount) || undefined}
                key="amount"
                placeholder="Amount"
                type="number"
                onFocus={() => setAmountTouched(true)}
                onChange={(e) => setAmount(parseFloat(e.target.value))}
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

    const modal = (
        <Modal isOpen={isOpen} onClose={close}>
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
                    <Button variant="ghost" onClick={close}>
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
