"use client";

import { HttpService } from "@/services/HttpService";
import { Button } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

export default function CreateActivity() {
    const router = useRouter();

    async function createActivity() {
        return await HttpService.POST("/activity/create");
    }

    return (
        <Button
            position="absolute"
            top={["40vh", "40vh"]}
            left="50%"
            transform="translate(-50%, 0)"
            size="lg"
            onClick={() =>
                createActivity().then((activity) => {
                    router.push("/" + activity.id);
                })
            }>
            New Activity
        </Button>
    );
}
