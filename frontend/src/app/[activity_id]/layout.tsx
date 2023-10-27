import CopyUrl from "./CopyUrl";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            {children}
            <CopyUrl />
        </>
    );
}
