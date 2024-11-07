"use client";

import ScrollText from "./ScrollText";
import LyricItem, { LyricStatus } from "./LyricIitem";
import { ArrowPathIcon } from "@heroicons/react/16/solid";
import useSongInfoAndLyric from "@/hooks/useSongInfoAndLyric";
import { Center } from "@/share/_components/Center";

type Props = {
   audioEle: HTMLAudioElement;
};

export default function SongInfoAndLyric({ audioEle }: Props) {
   const {
      currentLyricIndex,
      lyricRefs,
      tab,
      setTab,
      isFetching,
      lyrics,
      currentSongRef,
   } = useSongInfoAndLyric({ audioEle });

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
                     content={currentSongRef.current?.name || "..."}
                     className="font-bold text-2xl"
                  />
               </div>

               <p className="text-sm font-medium line-clamp-1">
                  {currentSongRef.current?.singer || "..."}
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
                              let status: LyricStatus = "coming";

                              if (index < currentLyricIndex) status = "done";
                              if (index === currentLyricIndex)
                                 status = "active";
                              return (
                                 <LyricItem
                                    key={index}
                                    className="pb-4"
                                    text={l.text}
                                    status={status}
                                    ref={(el) =>
                                       (lyricRefs.current[index] = el!)
                                    }
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
                  {currentSongRef.current?.name || "..."} -{" "}
                  {currentSongRef.current?.singer || "..."}
               </p>
            )}
         </div>
      </>
   );
}
