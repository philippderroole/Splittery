import { createContext } from "react";
import ActivityState from "./ActivityState";

const ActivityContext = createContext<ActivityState | null>(null);

export default ActivityContext;
