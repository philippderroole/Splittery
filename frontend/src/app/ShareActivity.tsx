"use client";

import { IconButton } from "@chakra-ui/react";
import { useParams } from "next/navigation";
import { BsFillShareFill } from "react-icons/bs";
import { shareOnMobile } from "react-mobile-share";

export default function ShareActivity() {
    const params = useParams();

    function share() {
        shareOnMobile({
            text: "Let's share expenses!",
            url: window.location.href,
            title: "Share Expenses",
        });
    }

    return (
        <>
            <IconButton
                aria-label={"copy url to clipboard"}
                colorScheme="green"
                icon={<BsFillShareFill />}
                hidden={params.activity_id === undefined}
                onClick={share}></IconButton>
        </>
    );
}
