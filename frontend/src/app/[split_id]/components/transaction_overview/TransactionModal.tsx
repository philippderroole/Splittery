"use client";

import { CurrencyFormat } from "@/services/CurrencyFormat";
import { Transaction } from "@/types/transaction";
import {
    Button,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
    InputGroup,
    InputRightAddon,
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
    useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import {
    validate_amount,
    validate_name,
    validate_payer,
    validate_receiver,
} from "../../../../services/Validation";

export default function TransactionModal({
    header,
    split_id,
    users,
    onSubmit,
    isOpen,
    onOpen,
    onClose,
    transaction,
    allowTransfer,
}: {
    header: string;
    split_id: number;
    users: any[];
    onSubmit: (
        tabIndex: number,
        amount: number,
        title: string,
        payerId: number,
        receiverId: number
    ) => any;
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
    transaction?: Transaction;
    allowTransfer?: boolean;
}) {
    const [tabIndex, setTabIndex] = React.useState(0);

    const [title, setName] = React.useState("");
    const [nameTouched, setNameTouched] = React.useState(false);

    const [amount, setAmount] = React.useState(0);
    const [amountTouched, setAmountTouched] = React.useState(false);

    const [payerId, setPayerId] = React.useState(users[0]?.id);
    const [receiverId, setReceiverId] = React.useState(
        users[1]?.id || users[0]?.id
    );

    React.useEffect(() => {
        setup();
    }, [transaction]);

    React.useEffect(() => {
        // If a new Split is created users is empty.
        // After the first user is created, the payerId and receiverId are set to the first user.
        if (payerId === undefined || receiverId === undefined) {
            setPayerId(users[0]?.id);
            setReceiverId(users[1]?.id || users[0]?.id);
        }
    }, [users]);

    function setup() {
        setTabIndex(transaction ? (transaction.amount < 0 ? 0 : 1) : 0);
        setName(transaction?.title || "");
        setAmount(
            transaction
                ? CurrencyFormat.round(Math.abs(transaction.amount), 2)
                : 0
        );
        setPayerId(transaction?.user_id || users[0]?.id);
        setReceiverId(transaction?.user_id || users[1]?.id || users[0]?.id);
    }

    function handleSubmit() {
        setNameTouched(true);
        setAmountTouched(true);

        if (validate_name(title) != undefined) {
            return;
        }
        if (validate_amount(amount) != undefined) {
            return;
        }

        switch (tabIndex) {
            case 0:
                if (validate_payer(tabIndex, payerId) != undefined) {
                    return;
                }
                break;
            case 1:
                if (
                    validate_receiver(tabIndex, payerId, receiverId) !=
                    undefined
                ) {
                    return;
                }
                break;
            case 2:
                if (
                    validate_receiver(tabIndex, payerId, receiverId) !=
                    undefined
                ) {
                    return;
                }
                if (validate_payer(tabIndex, payerId) != undefined) {
                    return;
                }
                break;
        }

        setNameTouched(false);
        setAmountTouched(false);

        setName("");
        setAmount(0);
        setPayerId(users[0]?.id);
        setReceiverId(users[1]?.id || users[0]?.id);

        onSubmit(tabIndex, amount, title, payerId, receiverId);
    }

    const name_form = (
        <FormControl
            paddingY={2}
            isRequired
            isInvalid={validate_name(title) != undefined && nameTouched}>
            <FormLabel>Title</FormLabel>
            <Input
                defaultValue={title}
                key="title"
                placeholder="Title"
                onChange={(e) => {
                    setName(e.target.value);
                    setNameTouched(true);
                }}
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
            <InputGroup>
                <Input
                    defaultValue={amount || ""}
                    key="amount"
                    placeholder="Amount"
                    type="number"
                    onChange={(e) => {
                        setAmount(parseFloat(e.target.value));
                        setAmountTouched(true);
                    }}
                />
                <InputRightAddon children="€" />
            </InputGroup>
            <FormErrorMessage>{validate_amount(amount)}</FormErrorMessage>
        </FormControl>
    );

    const payer_form = (
        <FormControl
            paddingY={2}
            isRequired
            isInvalid={validate_payer(tabIndex, payerId) != undefined}>
            <FormLabel>Paid by</FormLabel>
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
            <FormLabel>Received by</FormLabel>
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
        <Modal isOpen={isOpen} onClose={onClose} size={["sm", "md"]}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{header}</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    <Tabs
                        onChange={(index) => setTabIndex(index)}
                        index={tabIndex}>
                        <TabList>
                            <Tab>Expense</Tab>
                            <Tab>Income</Tab>
                            {allowTransfer ? <Tab>Transfer</Tab> : null}
                        </TabList>

                        <TabPanels>
                            <TabPanel>{expense_form}</TabPanel>
                            <TabPanel>{income_form}</TabPanel>
                            {allowTransfer ? (
                                <TabPanel>{transfer_form}</TabPanel>
                            ) : null}
                            <TabPanel>{transfer_form}</TabPanel>
                        </TabPanels>
                    </Tabs>
                </ModalBody>
                <ModalFooter>
                    <Button
                        colorScheme={useColorModeValue(
                            "light.primary",
                            "dark.primary"
                        )}
                        mr={3}
                        onClick={handleSubmit}>
                        Save
                    </Button>
                    <Button onClick={onClose}>Cancel</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );

    return <>{transaction_modal}</>;
}
