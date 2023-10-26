import { HttpService } from "@/services/HttpService";
import { Flex } from "@chakra-ui/react";
import CreateExpense from "./CreateExpense";
import ExpensesTable from "./ExpensesTable";

export default async function ExpensesTab({ params }) {
    const activity: Activity = {
        id: Array.isArray(params.activity_id)
            ? params.activity_id[0]
            : params.activity_id,
    };

    const users: User[] = await getAllUsers(activity);

    async function getAllUsers(activity: Activity): Promise<User[]> {
        return HttpService.POST("/user/getAll", activity, "no-store");
    }

    return (
        <div>
            <ExpensesTable params={params} />
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
