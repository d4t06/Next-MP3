import type { Metadata } from "next";
import { Inter } from "next/font/google";
import defaultTheme from "tailwindcss/defaultTheme";
import "./globals.css";
import "./styles.scss";
import bgImage from "../../public/bg-image.png";
import AuthProvider from "@/stores/sesstionContext";

const font = Inter({ subsets: ["latin"] });

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
         <meta content="#fcf3c7" name="theme-color" />

         <AuthProvider>
            <body
               style={{
                  fontFamily:
                     font.style.fontFamily +
                     "," +
                     defaultTheme.fontFamily.sans.join(","),
                  // backgroundImage: `url(${bgImage.src})`,
               }}
               className={`bg-[#fdf6e3]`}
            >
               {children}
               <div id="portals"></div>
            </body>
         </AuthProvider>
      </html>
   );
}
