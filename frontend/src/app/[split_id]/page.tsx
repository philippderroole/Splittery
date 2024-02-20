"use server";

import { HttpService } from "@/services/HttpService";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    Flex,
} from "@chakra-ui/react";
import SplitName from "./components/split_name";
import TransactionOverview from "./components/transaction_overview/transaction_overview";
import UserOverview from "./components/user_overview/user_overview";

export default async function Page({
    params,
}: {
    params: { split_id: string };
}) {
    const split_id = params.split_id;
    const split = await HttpService.GET(`/splits/${split_id}`, ["split"]);

    const users = await HttpService.GET(`/splits/${split_id}/users`, ["users"]);

    const transactions = await HttpService.GET(
        `/splits/${split_id}/transactions`,
        ["transactions"]
    );

    const Breadcrumps = () => (
        <Breadcrumb>
            <BreadcrumbItem>
                <BreadcrumbLink href=".">Splittery</BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbItem>
                <BreadcrumbLink href={split.id}>{split.name}</BreadcrumbLink>
            </BreadcrumbItem>
        </Breadcrumb>
    );

    return (
        <Flex
            direction="column"
            justify="start"
            align="left"
            padding="2em"
            flexGrow={1}>
            <Breadcrumps />
            <SplitName split={split}></SplitName>
            <UserOverview
                split={split}
                users={users}
                transactions={transactions}
            />
            <TransactionOverview
                split={split}
                users={users}
                transactions={transactions}
            />
        </Flex>
    );
}
