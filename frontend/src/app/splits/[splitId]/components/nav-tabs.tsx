"use client";

import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import { Link, useLocation, useParams } from "react-router-dom";
import React from "react";

export default function NavTabs() {
    const pathname = useLocation().pathname;
    const { splitId } = useParams();
    const basePath = `/splits/${splitId}`;

    const tabPaths = [
        `${basePath}/balances`,
        `${basePath}/tags`,
        `${basePath}/transactions`,
        `${basePath}/settle`,
    ];
    const currentTab = tabPaths.findIndex((p) => pathname.startsWith(p));

    return (
        <BottomNavigation showLabels value={currentTab}>
            <BottomNavigationLink
                icon={<AccountBalanceWalletIcon />}
                label="Balances"
                href={`${basePath}/balances`}
            />
            <BottomNavigationLink
                icon={<LocalOfferIcon />}
                label="Tags"
                href={`${basePath}/tags`}
            />
            <BottomNavigationLink
                icon={<ShoppingCartIcon />}
                label="Transactions"
                href={`${basePath}/transactions`}
            />
            {/* <BottomNavigationLink
                icon={<CurrencyExchangeIcon />}
                label="Settle"
                href={`${basePath}/settle`}
            /> */}
        </BottomNavigation>
    );
}

interface LinkTabProps {
    icon: string | React.ReactElement<unknown>;
    label: string;
    href: string;
}

function BottomNavigationLink(props: LinkTabProps) {
    return <BottomNavigationAction {...props} component={Link} to={props.href} />;
}
