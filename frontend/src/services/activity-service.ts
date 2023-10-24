import Activity from "@/interfaces/Activity";
import { HttpService } from "./http-service";

export abstract class ActivityService {
    public static createActivity(): Promise<Activity> {
        return HttpService.POST("/activity/create");
    }
}
