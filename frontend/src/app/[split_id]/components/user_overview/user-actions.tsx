import { AppEnvironment } from "@/types/app-environment";
import DeleteUserButton from "./delete_user_button";
import EditUserButton from "./edit_user_button";

export default function UserActions({
    app,
    user,
}: {
    app: AppEnvironment;
    user: any;
}) {
    const { split, users, transactions } = app;

    return (
        <>
            <EditUserButton split_id={split.id} user={user} users={users} />
            <DeleteUserButton
                split_id={split.id}
                user={user}
                transactions={transactions}
            />
        </>
    );
}
