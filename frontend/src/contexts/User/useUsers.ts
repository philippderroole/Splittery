import { useContext } from "react";
import UserContext from "./UserContext";
import UserState from "./UserState";

const useUsers = (): UserState => {
    const context = useContext(UserContext);

    if (!context) {
        throw new Error("Please use UserProvider in a parent component");
    }

    return context;
};

export default useUsers;
