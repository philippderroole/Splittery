import Expense from "@/interfaces/Expense";
import User from "@/interfaces/User";
import { SmallCloseIcon } from "@chakra-ui/icons";
import {
    Button,
    Flex,
    FormControl,
    FormErrorMessage,
    FormLabel,
    IconButton,
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
import { useRouter } from "next/router";
import { ReactElement, useState } from "react";

export default function Expenses({
    expenses,
    setExpenses,
    users,
    isOpen,
    onOpen,
    onClose,
}: {
    expenses: Expense[];
    setExpenses: Function;
    users: User[];
    setUsers: Function;
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}): ReactElement {
    const router = useRouter();
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
        <div>
            <TableContainer>
                <Table variant="simple">
                    <Thead>
                        <Tr>
                            <Th>Title</Th>
                            <Th isNumeric>Amount</Th>
                            <Th>Buyer</Th>
                            <Th></Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {expenses.map((expense) => (
                            <Tr
                                key={expense.title}
                                onClick={() =>
                                    router.push({
                                        pathname: "/expenses/" + expense.title,
                                        query: {
                                            title: expense.title,
                                        },
                                    })
                                }>
                                <Td>{expense.title}</Td>
                                <Td isNumeric>{expense.amount}</Td>
                                <Td>{expense.user.name}</Td>
                                <Td textAlign="right">
                                    <IconButton
                                        aria-label={"delete expense"}
                                        icon={<SmallCloseIcon></SmallCloseIcon>}
                                        variant="unstyled"
                                        onClick={() => {
                                            setExpenses(
                                                expenses.filter(
                                                    (e) =>
                                                        e.title !==
                                                        expense.title
                                                )
                                            );
                                        }}></IconButton>
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>
            <Flex
                direction="row"
                justify="center"
                align="center"
                paddingTop="1vb">
                <Button
                    onClick={() => {
                        onOpen();
                    }}>
                    Add Expense
                </Button>
            </Flex>
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
                            onClick={() => {
                                if (
                                    !isTitleValid(title) ||
                                    !isUserValid(user)
                                ) {
                                    return;
                                }
                                let expense: Expense = {
                                    title: title,
                                    amount: amount,
                                    user: user,
                                };
                                setExpenses([...expenses, expense]);
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
        </div>
    );
}
