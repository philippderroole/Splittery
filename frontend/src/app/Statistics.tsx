"use client";

import {
    Box,
    Flex,
    SimpleGrid,
    Stat,
    StatLabel,
    StatNumber,
    useColorModeValue,
} from "@chakra-ui/react";
import { ReactNode } from "react";
import { BsPerson, BsPiggyBank } from "react-icons/bs";
import { FaMoneyBillTransfer } from "react-icons/fa6";

interface StatsCardProps {
    title: string;
    stat: string;
    icon: ReactNode;
}

function StatsCard(props: StatsCardProps) {
    const { title, stat, icon } = props;
    return (
        <Stat
            paddingX={{ base: 2, md: 4 }}
            paddingY={"5"}
            shadow={"xl"}
            border={"1px solid"}
            borderColor={useColorModeValue("gray.800", "gray.500")}
            rounded={"lg"}>
            <Flex justifyContent={"space-between"}>
                <Box paddingLeft={{ base: 2, md: 4 }}>
                    <StatLabel fontWeight={"medium"} isTruncated>
                        {title}
                    </StatLabel>
                    <StatNumber fontSize={"2xl"} fontWeight={"medium"}>
                        {stat}
                    </StatNumber>
                </Box>
                <Box
                    paddingLeft={3}
                    marginY={"auto"}
                    color={useColorModeValue("gray.800", "gray.200")}
                    alignContent={"center"}>
                    {icon}
                </Box>
            </Flex>
        </Stat>
    );
}

export default function Statistics({
    activity_count,
    expense_count,
    user_count,
    paddingBottom,
}: {
    activity_count: number;
    expense_count: number;
    user_count: number;
    paddingBottom?: any;
}) {
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
