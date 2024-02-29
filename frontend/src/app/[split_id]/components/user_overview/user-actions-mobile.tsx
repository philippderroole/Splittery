import { AppEnvironment } from "@/types/app-environment";
import {
    IconButton,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverContent,
    PopoverTrigger,
} from "@chakra-ui/react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteUserButton from "./delete_user_button";
import EditUserButton from "./edit_user_button";

export default function UserActionsMobile({
    app,
    user,
}: {
    app: AppEnvironment;
    user: any;
}) {
    const { split, users, transactions } = app;

    return (
        <Popover>
            <PopoverTrigger>
                <IconButton
                    icon={<MoreVertIcon />}
                    aria-label={""}
                    variant="link"
                    size="sm"
                />
            </PopoverTrigger>
            <PopoverContent width={"fit-content"}>
                <PopoverArrow />
                <PopoverBody>
                    <EditUserButton
                        split_id={app.split.id}
                        user={user}
                        users={app.users}
                    />
                    <DeleteUserButton
                        split_id={app.split.id}
                        user={user}
                        transactions={app.transactions}
                    />
                </PopoverBody>
            </PopoverContent>
        </Popover>
    );
}
