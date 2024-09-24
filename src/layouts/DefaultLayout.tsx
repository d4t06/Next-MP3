import CurrentSongProvider from "@/stores/currentSongContext";
import { ReactNode } from "react";

export default function DefaultLayout({ children }: { children: ReactNode }) {
   return (
      <div className="fixed inset-0 flex items-center justify-center">
         <div className="absolute left-5 bottom-5 text-amber-800 font-[500] text-sm">Make with ❤️ by d4t06</div>
         <CurrentSongProvider>{children}</CurrentSongProvider>

      </div>
   );
}
