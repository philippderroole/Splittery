import { Center } from "@chakra-ui/react";
import CreateActivity from "./CreateActivity";

export default function HomePage() {
    return (
        <>
            <Center flexGrow={1}>
                <CreateActivity />
            </Center>
        </>
    );
}
