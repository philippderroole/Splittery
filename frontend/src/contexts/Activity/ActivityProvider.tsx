import Activity from "@/interfaces/Activity";
import { useState } from "react";
import ActivityContext from "./ActivityContext";

const BalanceProvider = ({ children }) => {
    const [activity, setActivity] = useState<Activity>({} as Activity);

    return (
        <ActivityContext.Provider value={{ activity, setActivity }}>
            {children}
        </ActivityContext.Provider>
    );
};

export default BalanceProvider;
