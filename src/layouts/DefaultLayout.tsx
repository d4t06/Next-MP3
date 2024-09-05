import CurrentSongProvider from "@/stores/currentSongContext";
import { ReactNode } from "react";

export default function DefaultLayout({ children }: { children: ReactNode }) {
   return (
      <div className="h-screen flex items-center justify-center">
         <CurrentSongProvider>{children}</CurrentSongProvider>
      </div>
   );
}
