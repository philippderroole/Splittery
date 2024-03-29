"use client";

import {
    Center,
    HStack,
    IconButton,
    useColorModeValue,
} from "@chakra-ui/react";
import Link from "next/link";
import { ReactNode } from "react";
import { AiFillGithub } from "react-icons/ai";

const SocialButton = ({
    children,
    label,
    href,
}: {
    children: ReactNode;
    label: string;
    href: string;
}) => {
    return (
        <Link href={href}>
            <IconButton
                size={"md"}
                aria-label={label}
                variant={"ghost"}
                isRound={true}
                _hover={{
                    filter: useColorModeValue(
                        "brightness(2.1)",
                        "brightness(0.7)"
                    ),
                }}
                icon={<Center>{children}</Center>}></IconButton>
        </Link>
    );
};

export default function IconBar() {
    return (
        <HStack spacing={5}>
            <SocialButton
                label={"GitHub"}
                href={"https://github.com/philippderroole/ShareExpenses"}>
                <AiFillGithub size="25" />
            </SocialButton>
        </HStack>
    );
}
