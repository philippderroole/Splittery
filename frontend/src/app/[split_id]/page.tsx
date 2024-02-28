"use server";

import { HttpService } from "@/services/HttpService";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    Flex,
    Hide,
    Show,
} from "@chakra-ui/react";
import { redirect } from "next/navigation";
import SplitName from "./components/split_name";
import TransactionOverview from "./components/transaction_overview/TransactionOverview";
import UserOverview from "./components/user_overview/UserOverview";

export default async function Page({
    params,
}: {
    params: { split_id: string };
}) {
    const split_id = params.split_id;
    const split = await HttpService.GET(`/splits/${split_id}`, ["split"]).catch(
        () => {
            redirect("/404");
        }
    );

    const users = await HttpService.GET(`/splits/${split_id}/users`, ["users"]);

    const transactions = await HttpService.GET(
        `/splits/${split_id}/transactions`,
        ["transactions"]
    );

    const breadcrumps = (
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
            justify={"start"}
            align={"left"}
            padding="2em"
            flexGrow={1}>
            {breadcrumps}
            <SplitName split={split}></SplitName>
            <Show above="md">
                <Flex direction="column" justify={"start"} align={"left"}>
                    <UserOverview
                        split={split}
                        users={users}
                        transactions={transactions}
                        size={["sm", "md", "xl"]}
                    />
                    <TransactionOverview
                        split={split}
                        users={users}
                        transactions={transactions}
                        size={["sm", "md", "lg"]}
                    />
                </Flex>
            </Show>
            <Hide above="md">
                <Flex direction="column" justify={"start"} align={"center"}>
                    <UserOverview
                        split={split}
                        users={users}
                        transactions={transactions}
                        size={["sm", "md", "xl"]}
                    />
                    <TransactionOverview
                        split={split}
                        users={users}
                        transactions={transactions}
                        size={["sm", "md", "lg"]}
                    />
                </Flex>
            </Hide>
        </Flex>
    );
}
