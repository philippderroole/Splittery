import useActivities from "@/contexts/Activity/useActivities";
import useBalances from "@/contexts/Balance/useBalances";
import useUsers from "@/contexts/User/useUsers";
import Balance from "@/interfaces/Balance";
import User from "@/interfaces/User";
import { UserService } from "@/services/user-service";
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
    Table,
    TableContainer,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
} from "@chakra-ui/react";
import { ReactElement, useState } from "react";

export default function Balances({
    isOpen,
    onOpen,
    onClose,
}: {
    balances: Balance[];
    setBalances: Function;
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}): ReactElement {
    const { users, setUsers } = useUsers();
    const { balances, setBalances } = useBalances();
    const { activity, setActivity } = useActivities();
    const [username, setUsername] = useState("");

    function isUsernameValid(username: string): boolean {
        return (
            !isUsernameTaken(username) &&
            !isEmpty(username) &&
            !isTooLong(username)
        );
    }

    function isUsernameTaken(username: string): boolean {
        return balances.some((expense) => expense.user.name === username);
    }

    function isEmpty(username: string): boolean {
        return username.length === 0;
    }

    function isTooLong(username: string): boolean {
        return username.length > 32;
    }

    return (
        <div>
            <TableContainer>
                <Table variant="simple">
                    <Thead>
                        <Tr>
                            <Th>User</Th>
                            <Th isNumeric>Amount</Th>
                            <Th></Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {balances.map((share) => (
                            <Tr key={share.user.name}>
                                <Td>{share.user.name}</Td>

                                <Td isNumeric>{share.amount}</Td>
                                <Td textAlign="right">
                                    <IconButton
                                        aria-label={"delete user"}
                                        icon={<SmallCloseIcon></SmallCloseIcon>}
                                        variant="unstyled"
                                        onClick={() => {
                                            setBalances(
                                                balances.filter(
                                                    (e) =>
                                                        e.user.name !==
                                                        share.user.name
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
                    Add User
                </Button>
            </Flex>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalContent>
                    <ModalHeader>Add User</ModalHeader>
                    <ModalBody>
                        <FormControl isInvalid={!isUsernameValid(username)}>
                            <FormLabel>Username</FormLabel>
                            <Input
                                type="text"
                                value={username}
                                onChange={(event) =>
                                    setUsername(event.target.value)
                                }
                            />
                            <FormErrorMessage>
                                {isUsernameTaken(username)
                                    ? "Username is taken"
                                    : isEmpty(username)
                                    ? "Username is empty"
                                    : isTooLong(username)
                                    ? "Username is too long"
                                    : ""}
                            </FormErrorMessage>
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
                                if (!isUsernameValid(username)) {
                                    return;
                                }

                                let user: User = {
                                    name: username,
                                    activity: activity,
                                };

                                UserService.createUser(user).then((user) => {
                                    setUsers([...users, user]);
                                });

                                let balance: Balance = {
                                    selected: true,
                                    share: 1,
                                    user: {
                                        name: username,
                                        activity: activity,
                                    },
                                    amount: 0,
                                };
                                setBalances([...balances, balance]);
                                setUsername("");
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
