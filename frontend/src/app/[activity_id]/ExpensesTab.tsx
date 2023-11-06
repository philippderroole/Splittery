"use client";

import { ActivityContext } from "@/lib/ActivityProvider";
import { Flex } from "@chakra-ui/react";
import { useContext } from "react";
import CreateExpense from "./CreateExpense";
import ExpensesTable from "./ExpensesTable";

export default function ExpensesTab({ params }) {
    const users: User[] = useContext(ActivityContext).users;

    return (
        <div>
            <ExpensesTable />
            <Flex
                direction="row"
                justify="center"
                align="center"
                paddingTop="1vb">
                <CreateExpense params={params} users={users} />
            </Flex>
        </div>
    );
}
