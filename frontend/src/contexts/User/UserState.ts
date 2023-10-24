import User from "@/interfaces/User";

type UserState = {
    users: User[];
    setUsers(users: User[]): void;
};

export default UserState;
