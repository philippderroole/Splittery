import TransactionGroupList from "@/components/transaction-group-list";

export default async function TransactionGroupListPage({
    params,
}: {
    params: Promise<{ splitId: string }>;
}) {
    const { splitId } = await params;

    return (
        <>
            <TransactionGroupList splitId={splitId} />
        </>
    );
}
