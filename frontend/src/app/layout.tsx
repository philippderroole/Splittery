export const metadata = {
    title: "Splittery",
    description: "A modern split bill management app",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
