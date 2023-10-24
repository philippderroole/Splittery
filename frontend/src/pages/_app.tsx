import ActivityProvider from "@/contexts/Activity/ActivityProvider";
import BalanceProvider from "@/contexts/Balance/BalanceProvider";
import UserProvider from "@/contexts/User/UserProvider";
import type { NextPage } from "next";
import type { AppProps } from "next/app";
import type { ReactElement, ReactNode } from "react";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
    getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
    const getLayout = Component.getLayout ?? ((page) => page);

    return getLayout(
        <ActivityProvider>
            <BalanceProvider>
                <UserProvider>
                    <Component {...pageProps} />
                </UserProvider>
            </BalanceProvider>
        </ActivityProvider>
    );
}
