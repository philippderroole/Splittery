import Layout from "@/components/Layout";
import useActivity from "@/contexts/Activity/useActivities";
import { ActivityService } from "@/services/activity-service";
import { Button } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { ReactElement } from "react";
import { NextPageWithLayout } from "./_app";

const Page: NextPageWithLayout = () => {
    const { activity, setActivity } = useActivity();
    const router = useRouter();

    return (
        <div>
            <Button
                position="absolute"
                top={["40vh", "40vh"]}
                left="50%"
                transform="translate(-50%, 0)"
                size="lg"
                onClick={() =>
                    ActivityService.createActivity().then((activity) => {
                        setActivity(activity);
                        router.push({
                            pathname: "/" + activity.id,
                        });
                    })
                }>
                New Activity
            </Button>
        </div>
    );
};

Page.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>;
};

export default Page;
