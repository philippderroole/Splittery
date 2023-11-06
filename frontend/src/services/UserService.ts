import { HttpService } from "./HttpService";

export abstract class UserService {
    static postUser(user: User): Promise<User> {
        return HttpService.POST("/user", user);
    }
}
