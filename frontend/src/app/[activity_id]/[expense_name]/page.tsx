"use client";

import {
    Button,
    Checkbox,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Input,
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
import { useState } from "react";

export default async function ExpenseInfoPage() {
    const router = useRouter();
    const title = router.query.title as string;

    const defaultUser = { name: "Philipp" } as User;
    const defautlAmount = 60;
    const defaultBalances = [
        {
            user: { name: "Philipp" } as User,
            amount: 0,
            is_selected: true,
            share: 1,
        },
        {
            user: { name: "Lukas" } as User,
            amount: 0,
            is_selected: false,
            share: 1,
        },
        {
            user: { name: "Julian" } as User,
            amount: 0,
            is_selected: false,
            share: 1,
        },
    ] as Balance[];

    const [balances, setBalances] = useState(defaultBalances);
    const [amount, setAmount] = useState(defautlAmount);
    const [user, setUser] = useState(defaultUser);

    function isUserValid(user: User): boolean {
        return user.name !== undefined;
    }

    function sum(myNums: number[]): number {
        let sum = 0;

        // calculate sum using forEach() method
        myNums.forEach((num) => {
            sum += num;
        });

        return sum;
    }

    function rountToDecimals(num: number, decimals: number): number {
        return (
            Math.round((num + Number.EPSILON) * 10 * decimals) / (10 * decimals)
        );
    }

    return (
        <Flex
            direction="column"
            justify="start"
            align="center"
            paddingLeft="5vw"
            paddingRight="5vw"
            paddingTop="10vh">
            <Heading>{title}</Heading>
            <FormControl paddingTop="1vb" width="15vw" paddingBottom="1vh">
                <FormLabel>Amount</FormLabel>
                <Input
                    type="number"
                    value={amount}
                    onChange={(event) => {
                        setAmount(parseFloat(event.target.value));
                    }}
                />
            </FormControl>
            <FormControl
                paddingTop="1vb"
                isInvalid={!isUserValid(user)}
                width="15vw"
                paddingBottom="2vh">
                <FormLabel>Who paid?</FormLabel>
                <Select
                    placeholder="Philipp"
                    onChange={(event) =>
                        setUser(
                            balances.find(
                                (balance) =>
                                    balance.user.name === event.target.value
                            )!.user
                        )
                    }>
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
                                            setBalances([...balances]);
                                        }}>
                                        -
                                    </Button>
                                    <Input
                                        variant="unstyled"
                                        width="2vw"
                                        textAlign="right"
                                        onChange={(event) => {
                                            balance.share = parseFloat(
                                                event.target.value === ""
                                                    ? "0"
                                                    : event.target.value
                                            );
                                            setBalances([...balances]);
                                        }}
                                        value={balance.share}
                                    />
                                    <Button
                                        variant="ghost"
                                        onClick={() => {
                                            balance.share += 0.1;
                                            setBalances([...balances]);
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
        </Flex>
    );
}
