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
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    useDisclosure,
} from "@chakra-ui/react";
import React from "react";

export default function AddTransactionButton({
    split_id,
    users,
}: {
    split_id: number;
    users: any[];
}) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const initialRef = React.useRef(null);

    const [name, setName] = React.useState("");
    const [touched, setTouched] = React.useState(false);

    function validate_name(): string | undefined {
        if (name.length === 0 && touched) {
            return "Name is required";
        }
    }

    const handleCreateTransaction = async () => {
        if (validate_name() != undefined) {
            return;
        }

        try {
            let new_user = {
                split_id: split_id,
                name: name,
            };

            const response = await HttpService.POST(
                `/splits/${split_id}/transactions`,
                new_user
            );

            revalidateTag("transactions");
            onClose();
        } catch (error) {
            console.error("Error creating transaction", error);
        }
    };

    const button = (
        <IconButton
            colorScheme="green"
            borderRadius="full"
            icon={<AddIcon />}
            aria-label={"add transaction"}
            onClick={onOpen}></IconButton>
    );

    function NameForm() {
        return (
            <FormControl isRequired isInvalid={validate_name() != undefined}>
                <FormLabel>Name</FormLabel>
                <Input
                    ref={initialRef}
                    placeholder="Name"
                    onFocus={() => setTouched(true)}
                    onChange={(e) => setName(e.target.value)}
                />
                <FormErrorMessage>{validate_name()}</FormErrorMessage>
            </FormControl>
        );
    }

    function AmountForm() {
        return (
            <FormControl>
                <FormLabel>Amount</FormLabel>
                <Input placeholder="Amount" />
            </FormControl>
        );
    }

    function PayerForm() {
        return (
            <FormControl>
                <FormLabel>Payer</FormLabel>
                <Input placeholder="Payer" />
            </FormControl>
        );
    }

    function ReceiverForm() {
        return (
            <FormControl>
                <FormLabel>Receiver</FormLabel>
                <Input placeholder="Receiver" />
            </FormControl>
        );
    }

    function ExpenseForm() {
        return (
            <>
                <NameForm />
                <AmountForm />
                <PayerForm />
            </>
        );
    }

    function IncomeForm() {
        return (
            <>
                <NameForm />
                <AmountForm />
                <ReceiverForm />
            </>
        );
    }

    function TransferForm() {
        return (
            <>
                <NameForm />
                <AmountForm />
                <PayerForm />
                <ReceiverForm />
            </>
        );
    }

    const modal = (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Add a new transaction</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    <Tabs>
                        <TabList>
                            <Tab>Expense</Tab>
                            <Tab>Income</Tab>
                            <Tab>Transfer</Tab>
                        </TabList>

                        <TabPanels>
                            <TabPanel>
                                <ExpenseForm />
                            </TabPanel>
                            <TabPanel>
                                <IncomeForm />
                            </TabPanel>
                            <TabPanel>
                                <TransferForm />
                            </TabPanel>
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

    return (
        <>
            {button}
            {modal}
        </>
    );
}
