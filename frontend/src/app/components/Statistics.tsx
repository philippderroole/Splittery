import { HttpService } from "@/services/HttpService";
import { Box, SimpleGrid } from "@chakra-ui/react";
import { BsPerson, BsPiggyBank } from "react-icons/bs";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import StatsCard from "./StatsCard";

interface StatisticsProps {
    paddingBottom: string;
}

export default async function Statistics(props: StatisticsProps) {
    const { paddingBottom } = props;

    const activity_count: number = await HttpService.GET("/activity/count");
    const expense_count: number = await HttpService.GET("/expense/count");
    const user_count: number = await HttpService.GET("/user/count");

    return (
        <Box
            maxW="7xl"
            mx={"auto"}
            pt={5}
            px={{ base: 2, sm: 12, md: 17 }}
            paddingBottom={paddingBottom}>
            <SimpleGrid
                columns={{ base: 1, md: 3 }}
                spacing={{ base: 5, lg: 8 }}>
                <StatsCard
                    title={"Created activities"}
                    stat={activity_count?.toString()}
                    icon={<BsPiggyBank size={"3em"} />}
                />
                <StatsCard
                    title={"Shared expenses"}
                    stat={expense_count?.toString()}
                    icon={<FaMoneyBillTransfer size={"3em"} />}
                />
                <StatsCard
                    title={"Added users"}
                    stat={user_count?.toString()}
                    icon={<BsPerson size={"3em"} />}
                />
            </SimpleGrid>
        </Box>
    );
}
