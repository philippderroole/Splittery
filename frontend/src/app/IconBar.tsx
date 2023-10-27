"use client";

import { IconButton } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { AiFillGithub } from "react-icons/ai";

export default function IconBar() {
    const router = useRouter();

    return (
        <>
            <IconButton
                variant="link"
                icon={<AiFillGithub size="27" />}
                aria-label={"github"}
                onClick={() =>
                    router.push(
                        "https://github.com/philippderroole/ShareExpenses"
                    )
                }></IconButton>
        </>
    );
}
