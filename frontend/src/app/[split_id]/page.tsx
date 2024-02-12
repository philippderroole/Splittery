import { HttpService } from "@/services/HttpService";
import { Button, Center, Flex } from "@chakra-ui/react";
import Hero from "../components/hero";
import SplitName from "./components/split_name";

export default async function Page({ split_id }) {
    if (split_id) {
        const split = await HttpService.GET("/splits/" + split_id).then(
            (data) => {
                console.log(data);
                return data;
            }
        );
    }

    return (
        <>
            <Flex
                direction="column"
                justify="start"
                align="center"
                paddingLeft="5vw"
                paddingRight="5vw"
                paddingTop="10vh">
                <SplitName></SplitName>
                <Center>
                    <Button>Activity</Button>
                </Center>

                <Hero />
            </Flex>
        </>
    );
}
