import DefaultLayout from "@/layouts/DefaultLayout";

export default function LobbyLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return <DefaultLayout>{children}</DefaultLayout>;
}
