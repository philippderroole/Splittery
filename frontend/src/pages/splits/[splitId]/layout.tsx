import { Box, CircularProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MembersProvider } from "@/providers/member-provider";
import { SplitProvider } from "@/providers/split-provider";
import { TagsProvider } from "@/providers/tag-provider";
import { TransactionsProvider } from "@/providers/transactions-provider";
import { getMembers } from "@/service/member-service";
import { getSplit } from "@/service/split-service";
import { getTags } from "@/service/tag-service";
import { getTransactions } from "@/service/transaction-service";
import { Split } from "@/utils/split";
import { SerializedTransaction } from "@/utils/transaction";
import { Tag } from "@/utils/tag";
import { SerializedMember } from "@/utils/user";
import AccountMenu from "@/components/account-menu";
import SplitHeader from "./components/split-header";
import NavTabs from "./components/nav-tabs";

type SplitLayoutData = {
  split: Split;
  members: SerializedMember[];
  transactions: SerializedTransaction[];
  tags: Tag[];
};

export default function SplitLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { splitId } = useParams();
  const [data, setData] = useState<SplitLayoutData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!splitId) {
      setError("Split not found");
      return;
    }

    const currentSplitId: string = splitId;

    let cancelled = false;

    async function loadSplit() {
      try {
        const [split, tags, members, transactions] = await Promise.all([
          getSplit(currentSplitId),
          getTags(currentSplitId),
          getMembers(currentSplitId),
          getTransactions(currentSplitId),
        ]);

        if (!cancelled) {
          setData({ split, tags, members, transactions });
        }
      } catch (loadError) {
        console.error("Error fetching split data:", loadError);
        if (!cancelled) {
          setError("Split not found");
        }
      }
    }

    async function trackVisit() {
      try {
        await fetch(
          `${import.meta.env.VITE_INTERNAL_API_URL}/splits/${currentSplitId}/visits`,
          {
            method: "POST",
            credentials: "include",
          },
        );
      } catch (visitError) {
        console.error("Error tracking split visit:", visitError);
      }
    }

    setData(null);
    setError(null);
    loadSplit();
    trackVisit();

    return () => {
      cancelled = true;
    };
  }, [splitId]);

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h4">{error}</Typography>
      </Box>
    );
  }

  if (!data) {
    return (
      <Box
        sx={{
          minHeight: "100dvh",
          display: "grid",
          placeItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div>
      <AccountMenu />
      <SplitProvider split={data.split}>
        <TransactionsProvider serializedTransactions={data.transactions}>
          <MembersProvider serializedMembers={data.members}>
            <TagsProvider tags={data.tags}>
              <SplitHeader />
              {children}
            </TagsProvider>
          </MembersProvider>
        </TransactionsProvider>
      </SplitProvider>
      <div
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1000,
        }}
      >
        <NavTabs />
      </div>
    </div>
  );
}
