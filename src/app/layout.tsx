import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/stores/sesstionContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
   title: "Next MP3",
   description: "Generated by create next app",
};

export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <html lang="en">
         <AuthProvider>
            <body className={`${inter.className} bg-amber-100`}>
               {children}
               <div id="portals"></div>
            </body>
         </AuthProvider>
      </html>
   );
}
