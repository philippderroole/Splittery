"use client";

import { Editable } from "@chakra-ui/react";
import { usePathname } from "next/navigation";

export default function SplitName() {
    const pathname = usePathname();

    return (
        <>
            <Editable>{pathname}</Editable>
        </>
    );
}
