import {
    Flex,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
} from "@chakra-ui/react";
import BalancesTab from "./BalancesTab";
import ExpensesTab from "./ExpensesTab";

export default async function Activity({ params }) {
    return (
        <Flex
            direction="column"
            justify="start"
            align="center"
            paddingLeft="5vw"
            paddingRight="5vw"
            paddingTop="10vh">
            <Tabs>
                <TabList>
                    <Tab width={["50vw", "15vw"]}>Balances</Tab>
                    <Tab width={["50vw", "15vw"]}>Expenses</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <BalancesTab params={params} />
                    </TabPanel>
                    <TabPanel>
                        <ExpensesTab params={params} />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Flex>
    );
}
