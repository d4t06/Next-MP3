import CurrentSongProvider from "@/stores/currentSongContext";
import { ReactNode } from "react";

export default function DefaultLayout({ children }: { children: ReactNode }) {
   return (
      <div className="fixed inset-0 flex items-center justify-center">
         <CurrentSongProvider>{children}</CurrentSongProvider>
      </div>
   );
}
