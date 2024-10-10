"use client";

import { ElementRef, RefObject } from "react";
import ScrollText from "./ScrollText";
import LyricItem from "./LyricIitem";
import { ArrowPathIcon } from "@heroicons/react/16/solid";
import useSongInfoAndLyric from "@/hooks/useSongInfoAndLyric";

type Props = {
   currentSong: Song;
   audioRef: RefObject<ElementRef<"audio">>;
};

export default function SongInfoAndLyric({ currentSong, audioRef }: Props) {
   const { currentTime, tab, setTab, isFetching, lyrics, scrollBehavior } =
      useSongInfoAndLyric({ audioRef, currentSong });

   return (
      <>
         <div
            className="mt-2"
            onClick={() => (tab === "info" ? setTab("lyrics") : setTab("info"))}
         >
            <div
               className={`${
                  tab === "info"
                     ? "opacity-[1]"
                     : "opacity-0 pointer-events-none h-0"
               } text-center text-amber-100 `}
            >
               <div className="h-[32px]">
                  <ScrollText
                     content={currentSong?.name || "..."}
                     className="font-bold text-2xl"
                  />
               </div>

               <p className="text-sm font-medium line-clamp-1">
                  {currentSong?.singer || "..."}
               </p>
            </div>

            <div
               className={`${
                  tab === "lyrics"
                     ? "opacity-[1] h-[30vh]"
                     : "opacity-0 pointer-events-none h-0"
               } overflow-auto text-center text-amber-100 text-lg no-scrollbar`}
            >
               {isFetching ? (
                  <ArrowPathIcon className="w-6 animate-spin" />
               ) : (
                  <>
                     {lyrics?.length ? (
                        <>
                           {lyrics.map((l, index) => {
                              let status = "coming";

                              if (currentTime >= l.start) {
                                 if (
                                    (lyrics[index + 1] &&
                                       currentTime < lyrics[index + 1].start) ||
                                    index === lyrics.length - 1
                                 )
                                    status = "active";
                                 else status = "done";
                              }

                              return (
                                 <LyricItem
                                    className="pb-3"
                                    text={l.text}
                                    //@ts-ignore
                                    status={status}
                                    scrollBehavior={scrollBehavior}
                                 />
                              );
                           })}
                        </>
                     ) : (
                        <p>...</p>
                     )}
                  </>
               )}
            </div>
         </div>
      </>
   );
}
