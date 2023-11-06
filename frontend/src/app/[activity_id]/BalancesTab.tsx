import { Flex } from "@chakra-ui/react";
import BalancesTable from "./BalancesTable";
import CreateUser from "./CreateUser";

export default async function BalancesTab() {
    return (
        <div>
            <BalancesTable />
            <Flex
                direction="row"
                justify="center"
                align="center"
                paddingTop="1vb">
                <CreateUser />
            </Flex>
        </div>
    );
}
