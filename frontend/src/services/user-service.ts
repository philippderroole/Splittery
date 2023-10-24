import User from "@/interfaces/User";
import { HttpService } from "./http-service";

export abstract class UserService {
    public static createUser(user: User): Promise<User> {
        return HttpService.POST("/user/create", user);
    }
}
