import Activity from "@/interfaces/Activity";

type ActivityState = {
    activity: Activity;
    setActivity(activity: Activity): void;
};

export default ActivityState;
