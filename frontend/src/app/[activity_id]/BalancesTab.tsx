import { Flex } from "@chakra-ui/react";
import BalancesTable from "./BalancesTable";
import CreateUser from "./CreateUser";

export default async function BalancesTab({ params }) {
    return (
        <div>
            <BalancesTable params={params} />
            <Flex
                direction="row"
                justify="center"
                align="center"
                paddingTop="1vb">
                <CreateUser params={params} />
            </Flex>
        </div>
    );
}
