import Balances from "@/components/Balances";
import { DarkModeSwitch } from "@/components/DarkModeSwitch";
import Expenses from "@/components/Expenses";
import Layout from "@/components/Layout";
import Balance from "@/interfaces/Balance";
import Expense from "@/interfaces/Expense";
import User from "@/interfaces/User";
import {
    Flex,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    useDisclosure,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState, type ReactElement } from "react";
import { NextPageWithLayout } from "./_app";

const Home: NextPageWithLayout = () => {
    const router = useRouter();
    const id = router.query.id as string;

    const [users, setUsers] = useState([] as User[]);
    const [expenses, setExpenses] = useState([] as Expense[]);
    const [balances, setBalances] = useState([] as Balance[]);

    const { isOpen, onOpen, onClose } = useDisclosure();
    const {
        isOpen: isOpen2,
        onOpen: onOpen2,
        onClose: onClose2,
    } = useDisclosure();

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
                        <Balances
                            balances={balances}
                            setBalances={setBalances}
                            isOpen={isOpen2}
                            onOpen={onOpen2}
                            onClose={onClose2}></Balances>
                    </TabPanel>
                    <TabPanel>
                        <Expenses
                            expenses={expenses}
                            setExpenses={setExpenses}
                            users={users}
                            setUsers={setUsers}
                            isOpen={isOpen}
                            onOpen={onOpen}
                            onClose={onClose}></Expenses>
                    </TabPanel>
                </TabPanels>
            </Tabs>
            <DarkModeSwitch></DarkModeSwitch>
        </Flex>
    );
};

Home.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>;
};

export default Home;
