"use client";

import ScrollText from "./ScrollText";
import LyricItem from "./LyricIitem";
import { ArrowPathIcon } from "@heroicons/react/16/solid";
import useSongInfoAndLyric from "@/hooks/useSongInfoAndLyric";
import { Center } from "@/share/_components/Center";

type Props = {
   currentSong: Song;
   audioEle: HTMLAudioElement
};

export default function SongInfoAndLyric({ currentSong, audioEle }: Props) {
   const { currentTime, tab, setTab, isFetching, lyrics, scrollBehavior } =
      useSongInfoAndLyric({ audioEle, currentSong });

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
               } relative cursor-pointer text-center text-amber-100 `}
            >
               <p className="flex">
                  <span className="ml-auto text-[6px] py-[2px]  text-amber-800 px-1 rounded-full bg-amber-100">
                     &#9679; &#9679; &#9679;
                  </span>
               </p>
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
                     ? "opacity-[1] h-[30vh] pt-4 pb-[7vh]"
                     : "opacity-0 pointer-events-none h-0"
               }  overflow-auto text-center relative text-amber-100 font-[800] text-2xl no-scrollbar mask-vertical`}
            >
               {isFetching ? (
                  <Center>
                     <ArrowPathIcon className=" w-6 animate-spin" />
                  </Center>
               ) : (
                  <>
                     {lyrics?.length ? (
                        <>
                           {lyrics.map((l, index) => {
                              let status = "coming";

                              if (currentTime >= l.start - 0.3) {
                                 if (
                                    (lyrics[index + 1] &&
                                       currentTime <
                                          lyrics[index + 1].start - 0.3) ||
                                    index === lyrics.length - 1
                                 )
                                    status = "active";
                                 else status = "done";
                              }

                              return (
                                 <LyricItem
                                    key={index}
                                    className="pb-4"
                                    text={l.text}
                                    //@ts-ignore
                                    status={status}
                                    scrollBehavior={scrollBehavior}
                                    shouldScroll={tab === "lyrics"}
                                 />
                              );
                           })}
                        </>
                     ) : (
                        <Center>
                           <p>...</p>
                        </Center>
                     )}
                  </>
               )}
            </div>
            {tab === "lyrics" && (
               <p className="text-sm mt-2 text-amber-100/60 text-center">
                  {currentSong.name} - {currentSong.singer}
               </p>
            )}
         </div>
      </>
   );
}
