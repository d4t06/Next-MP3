import CurrentSongProvider from "@/stores/currentSongContext";
import { ReactNode } from "react";

export default function DefaultLayout({ children }: { children: ReactNode }) {
   return (
      <div className="fixed inset-0 flex items-center justify-center">
         <CurrentSongProvider>{children}</CurrentSongProvider>
         <div className="absolute left-8 bottom-2 text-amber-800 font-[500] text-sm">
            Make with ❤️ by d4t06
         </div>
      </div>
   );
}
