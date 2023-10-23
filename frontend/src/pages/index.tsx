import Layout from "@/components/Layout";
import { Button } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { ReactElement } from "react";
import { NextPageWithLayout } from "./_app";

const Page: NextPageWithLayout = () => {
    const router = useRouter();

    return (
        <div>
            <Button
                position="absolute"
                top={["40vh", "40vh"]}
                left="50%"
                transform="translate(-50%, 0)"
                onClick={() =>
                    router.push({
                        pathname: "/home",
                        query: { id: "1" },
                    })
                }>
                New Expense
            </Button>
        </div>
    );
};

Page.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>;
};

export default Page;
