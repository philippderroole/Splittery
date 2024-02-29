import { AppEnvironment } from "@/types/app-environment";
import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Hide,
    Show,
    Spacer,
    Table,
    TableContainer,
    Tbody,
    Td,
    Tr,
} from "@chakra-ui/react";
import Currency from "../Currency";
import {
    getAmountDue,
    getAmountOutstanding,
    getAmountReceived,
    getAmountSpent,
} from "./balances";
import TooltipMobile from "./tooltip-mobile";

const spentTooltip = (
    <TooltipMobile text="The total amount of money spent by the user." />
);

const receivedTooltip = (
    <TooltipMobile text="The total amount of money received by the user." />
);

const dueTooltip = (
    <TooltipMobile text="The amount of money the user owes to the group." />
);
const outstandingTooltip = (
    <TooltipMobile text="The amount of money the user still has to receive from the group." />
);

const buttons = (app, user) => (
    <>
        <Show above="sm"></Show>
        <Hide above="sm"></Hide>
    </>
);

export default function UserTableMobile({ app }: { app: AppEnvironment }) {
    const { split, users, transactions } = app;

    return (
        <Accordion allowMultiple>
            {users.map((user) => (
                <AccordionItem>
                    <h2 style={{ display: "flex", alignItems: "center" }}>
                        <AccordionButton as="div" paddingRight={0}>
                            {user.name}
                            <AccordionIcon />
                            <Spacer />
                            {getAmountDue(transactions, users, user.id) <= 0 &&
                            getAmountOutstanding(
                                transactions,
                                users,
                                user.id
                            ) <= 0 ? (
                                <Currency fontWeight="bold" amount={0} />
                            ) : null}
                            {getAmountDue(transactions, users, user.id) > 0 ? (
                                <Currency
                                    fontWeight="bold"
                                    amount={
                                        -getAmountDue(
                                            transactions,
                                            users,
                                            user.id
                                        )
                                    }
                                    textColor={"red.300"}
                                />
                            ) : null}
                            {getAmountOutstanding(
                                transactions,
                                users,
                                user.id
                            ) > 0 ? (
                                <Currency
                                    fontWeight="bold"
                                    amount={getAmountOutstanding(
                                        transactions,
                                        users,
                                        user.id
                                    )}
                                    textColor={"green.300"}
                                />
                            ) : null}
                        </AccordionButton>

                        {buttons(app, user)}
                    </h2>
                    <AccordionPanel paddingBottom={4}>
                        <TableContainer>
                            <Table variant="simple">
                                <Tbody>
                                    <Tr>
                                        <Td paddingY={2}>
                                            Spent
                                            {spentTooltip}
                                        </Td>
                                        <Td paddingY={2} isNumeric>
                                            <Currency
                                                amount={getAmountSpent(
                                                    transactions,
                                                    user.id
                                                )}
                                            />
                                        </Td>
                                    </Tr>
                                    <Tr>
                                        <Td paddingY={2}>
                                            Received
                                            {receivedTooltip}
                                        </Td>
                                        <Td paddingY={2} isNumeric>
                                            <Currency
                                                amount={getAmountReceived(
                                                    transactions,
                                                    user.id
                                                )}
                                            />
                                        </Td>
                                    </Tr>
                                    <Tr>
                                        <Td paddingY={2}>
                                            Due
                                            {dueTooltip}
                                        </Td>
                                        <Td paddingY={2} isNumeric>
                                            <Currency
                                                amount={getAmountDue(
                                                    transactions,
                                                    users,
                                                    user.id
                                                )}
                                            />
                                        </Td>
                                    </Tr>
                                    <Tr>
                                        <Td paddingY={2}>
                                            Outstanding
                                            {outstandingTooltip}
                                        </Td>
                                        <Td paddingY={2} isNumeric>
                                            <Currency
                                                amount={getAmountOutstanding(
                                                    transactions,
                                                    users,
                                                    user.id
                                                )}
                                            />
                                        </Td>
                                    </Tr>
                                </Tbody>
                            </Table>
                        </TableContainer>
                    </AccordionPanel>
                </AccordionItem>
            ))}
        </Accordion>
    );
}
