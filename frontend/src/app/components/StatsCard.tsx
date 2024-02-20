"use client";

import { useColorModeValue } from "@chakra-ui/color-mode";
import {
    Box,
    Center,
    Flex,
    Stat,
    StatLabel,
    StatNumber,
} from "@chakra-ui/react";
import { ReactNode } from "react";

interface StatsCardProps {
    title: string;
    stat: string;
    icon: ReactNode;
}
export default function StatsCard(props: StatsCardProps) {
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
                <Center
                    paddingLeft={3}
                    color={useColorModeValue("gray.800", "gray.200")}>
                    {icon}
                </Center>
            </Flex>
        </Stat>
    );
}
