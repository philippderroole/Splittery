import { HttpService } from "@/services/HttpService";
import { Center } from "@chakra-ui/react";
import Hero from "./Hero";
import Statistics from "./Statistics";

export default async function HomePage() {
    const activity_count = await HttpService.GET("/activity/count", "no-store");
    const expense_count = await HttpService.GET("/expense/count", "no-store");
    const user_count = await HttpService.GET("/user/count", "no-store");

    return (
        <>
            <Center flexGrow={1}>
                <Hero />
            </Center>
            <Statistics
                paddingBottom="10vh"
                activity_count={activity_count}
                expense_count={expense_count}
                user_count={user_count}
            />
        </>
    );
}
