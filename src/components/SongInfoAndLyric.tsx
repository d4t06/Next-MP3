"use client";

import ScrollText from "./ScrollText";
import { getShowHideClass } from "@/share/utils/appHelper";
import SongLyricWrapper from "./SongLyricWrapper";
import { usePlayerContext } from "@/stores/PlayerContext";

export default function SongInfoAndLyric() {
   const { tab, setTab, currentSongRef } = usePlayerContext();

   return (
      <>
         <div
            className="mt-2"
            onClick={() =>
               tab === "playing" ? setTab("lyric") : setTab("playing")
            }
         >
            <div
               className={`${getShowHideClass(
                  tab === "playing"
               )} relative cursor-pointer text-center text-amber-100 `}
            >
               <p className="flex">
                  <span className="ml-auto text-[6px] py-[2px]  text-amber-800 px-1 rounded-full bg-amber-100">
                     &#9679; &#9679; &#9679;
                  </span>
               </p>
               <div className="h-[32px]">
                  <ScrollText
                     content={currentSongRef.current?.name || "..."}
                     className="font-bold text-2xl"
                  />
               </div>

               <p className="text-sm font-medium line-clamp-1">
                  {currentSongRef.current?.singer || "..."}
               </p>
            </div>

            <div
               className={`${getShowHideClass(
                  tab === "lyric",
                  "h-[30vh] pt-4 pb-[7vh]"
               )}  overflow-auto text-center relative text-amber-100 font-[800] text-[22px] sm:text-[26px] no-scrollbar mask-vertical`}
            >
               <SongLyricWrapper />
            </div>
         </div>
         {tab === "lyric" && (
            <p className="mt-2 text-sm pointer-events-none text-amber-100/60 text-center">
               {currentSongRef.current?.name || "..."} -{" "}
               {currentSongRef.current?.singer || "..."}
            </p>
         )}
      </>
   );
}
