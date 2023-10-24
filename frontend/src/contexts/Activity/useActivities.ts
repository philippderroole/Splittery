import { useContext } from "react";
import ActivityContext from "./ActivityContext";
import ActivityState from "./ActivityState";

const useActivities = (): ActivityState => {
    const context = useContext(ActivityContext);

    if (!context) {
        throw new Error("Please use ActivityProvider in a parent component");
    }

    return context;
};

export default useActivities;
