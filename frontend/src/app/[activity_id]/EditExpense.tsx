"use client";

import {
    Button,
    Checkbox,
    FormControl,
    FormLabel,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Select,
    Table,
    TableContainer,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
} from "@chakra-ui/react";

export default function EditExpense({ isOpen, onOpen, onClose }) {
    const balances = [] as Balance[];

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalContent>
                <ModalHeader>Add Expense</ModalHeader>
                <ModalBody>
                    <FormControl
                        paddingTop="1vb"
                        width="15vw"
                        paddingBottom="1vh">
                        <FormLabel>Amount</FormLabel>
                        <Input type="number" onChange={(event) => {}} />
                    </FormControl>
                    <FormControl
                        paddingTop="1vb"
                        width="15vw"
                        paddingBottom="2vh">
                        <FormLabel>Who paid?</FormLabel>
                        <Select placeholder="Philipp" onChange={(event) => {}}>
                            {balances.map((balance) => (
                                <option key={balance.user.name}>
                                    {balance.user.name}
                                </option>
                            ))}
                        </Select>
                    </FormControl>
                    <TableContainer>
                        <Table variant="simple">
                            <Thead>
                                <Tr>
                                    <Th>User</Th>
                                    <Th isNumeric>Selected</Th>
                                    <Th isNumeric>Share</Th>
                                    <Th isNumeric>Amount</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {balances.map((balance) => (
                                    <Tr key={balance.user.name}>
                                        <Td>{balance.user.name}</Td>
                                        <Td textAlign="right">
                                            <Checkbox
                                                isChecked={balance.is_selected}
                                                onChange={(event) => {
                                                    balance.is_selected =
                                                        event.target.checked;
                                                }}></Checkbox>
                                        </Td>
                                        <Td textAlign="right">
                                            <Button
                                                variant="ghost"
                                                onClick={() => {
                                                    balance.share -= 0.1;
                                                }}>
                                                -
                                            </Button>
                                            <Input
                                                variant="unstyled"
                                                width="2vw"
                                                textAlign="right"
                                                onChange={(event) => {
                                                    balance.share = parseFloat(
                                                        event.target.value ===
                                                            ""
                                                            ? "0"
                                                            : event.target.value
                                                    );
                                                }}
                                                value={balance.share}
                                            />
                                            <Button
                                                variant="ghost"
                                                onClick={() => {
                                                    balance.share += 0.1;
                                                }}>
                                                +
                                            </Button>
                                        </Td>
                                        <Td isNumeric>{balance.amount} €</Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </TableContainer>
                </ModalBody>
                <ModalFooter>
                    <Button variant="ghost" onClick={() => onClose()}>
                        Cancel
                    </Button>

                    <Button
                        colorScheme="blue"
                        mr={3}
                        onClick={() => {
                            onClose();
                        }}>
                        Add
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
