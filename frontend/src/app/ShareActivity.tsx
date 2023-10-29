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
            title: "Splittery",
        });
    }

    return (
        <>
            <IconButton
                aria-label={"share activity"}
                colorScheme="green"
                icon={<BsFillShareFill />}
                hidden={params.activity_id === undefined}
                onClick={share}></IconButton>
        </>
    );
}
