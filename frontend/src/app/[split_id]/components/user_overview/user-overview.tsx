"use server";

import { CurrencyFormat } from "@/services/CurrencyFormat";
import { AppEnvironment } from "@/types/app-environment";
import { Box, Flex, Heading, Hide, Show, Text } from "@chakra-ui/react";
import LayoutBox from "../LayoutBox";
import { getTotalAmountSpent } from "./balances";
import CreateUserButton from "./create_user_button";
import UserTable from "./user-table";
import UserTableMobile from "./user-table-mobile";

const total = (transactions) => (
    <Box>
        <Heading fontSize="3xl">
            {CurrencyFormat.format(getTotalAmountSpent(transactions))}
        </Heading>
        <Text opacity={0.7} fontSize="sm">
            Total Spent
        </Text>
    </Box>
);

const tableFooter = (app) => (
    <Flex
        paddingTop={3}
        direction="row"
        justifyContent="space-between"
        alignItems="center">
        {total(app.transactions)}
        <CreateUserButton
            split_id={app.split.id}
            users={app.users}></CreateUserButton>
    </Flex>
);

export default async function UserOverview({
    app,
    size,
}: {
    app: AppEnvironment;
    size?: string[];
}) {
    return (
        <LayoutBox name="Overview" size={size}>
            <Show above="md">
                <UserTable app={app} size={size} />
            </Show>
            <Hide above="md">
                <UserTableMobile app={app} />
            </Hide>
            {tableFooter(app)}
        </LayoutBox>
    );
}
