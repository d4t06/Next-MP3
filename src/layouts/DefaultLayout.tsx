import CurrentSongProvider from "@/stores/currentSongContext";
import { ReactNode } from "react";

export default function DefaultLayout({ children }: { children: ReactNode }) {
   return (
      <div className="fixed left-0 top-0 right-0 bottom-0 flex items-center justify-center">
         <CurrentSongProvider>{children}</CurrentSongProvider>
         <div className="absolute left-8 bottom-2 text-amber-800 font-[500] text-sm">
            Make with <b className="text-[#cd1818]">❤️</b> by d4t06
         </div>
      </div>
   );
}
