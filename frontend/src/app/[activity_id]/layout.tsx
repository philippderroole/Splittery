import ActivityProvider, { ActivityState } from "@/lib/ActivityProvider";
import { HttpService } from "@/services/HttpService";

export default async function Layout({
    params,
    children,
}: {
    params: any;
    children: React.ReactNode;
}) {
    const activity: Activity = await HttpService.GET(
        "/activity/" + params.activity_id
    );

    let users: User[] = [];
    for (const user_id of activity.user_ids) {
        users.push(await HttpService.GET("/user/" + user_id));
    }

    const activity_state: ActivityState = {
        activity: activity,
        users: users,
    } as ActivityState;

    return (
        <>
            <ActivityProvider activity_state={activity_state}>
                {children}
            </ActivityProvider>
        </>
    );
}
