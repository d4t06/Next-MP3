"use client";

import { songs } from "@/data";
import useControl from "@/hooks/useControl";
import useVolume from "@/hooks/useVolume";
import Button from "@/share/_components/Button";
import Frame from "@/share/_components/Frame";
import { formatTime } from "@/share/utils/appHelper";
import { useCurrentSong } from "@/stores/currentSongContext";
import {
   ArrowPathIcon,
   BackwardIcon,
   ForwardIcon,
   PauseIcon,
   PlayIcon,
   SpeakerWaveIcon,
   SpeakerXMarkIcon,
} from "@heroicons/react/24/outline";
import { ElementRef, useRef } from "react";

export default function Control() {
   const { currentSong } = useCurrentSong();

   const processLineRef = useRef<ElementRef<"div">>(null);
   const timeHolderRef = useRef<ElementRef<"div">>(null);
   const audioRef = useRef<ElementRef<"audio">>(null);
   const currentTimeRef = useRef<ElementRef<"div">>(null);

   const {
      handleNext,
      handlePlayPause,
      handlePrevious,
      handleSeek,
      isWaiting,
      isPlaying,
   } = useControl({
      audioRef,
      songs: songs,
      currentTimeRef,
      processLineRef,
      timeHolderRef,
   });

   const { handleMute, handleWheel, isMute } = useVolume({ audioRef });

   return (
      <>
         <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <audio
               ref={audioRef}
               src={currentSong?.song_url}
               className="hidden"
            ></audio>

            <div className="w-[400px] max-w-[90vw]">
               <Frame pushAble={"clear"}>
                  <div className="mt-2 rounded-md p-3 text-center text-amber-100">
                     <h5 className="font-bold text-2xl line-clamp-1">
                        {currentSong?.name || "..."}
                     </h5>
                     <p className="text-sm font-medium line-clamp-1">
                        {currentSong?.singer || "..."}
                     </p>
                  </div>

                  <div className="h-[6px] my-2 flex items-center">
                     <div
                        ref={processLineRef}
                        onClick={handleSeek}
                        className={
                           "relative group h-full sm:h-1 hover:h-full  w-full rounded-full bg-white/30 before:content-[''] before:w-[100%] before:h-[16px] before:absolute before:top-[50%] before:translate-y-[-50%] " +
                           `${!currentSong && "disabled"}`
                        }
                     >
                        <div
                           ref={timeHolderRef}
                           className="absolute hidden sm:block opacity-0 group-hover:opacity-[100] h-6 w-3 rounded-sm bg-amber-900 border-[2px] border-amber-200 top-1/2 -translate-y-1/2 -translate-x-1/2"
                        ></div>
                     </div>
                  </div>

                  <div className="flex justify-between items-center h-[30px] text-amber-100">
                     <div ref={currentTimeRef}>0:00</div>
                     <div>{formatTime(currentSong?.duration || 0)}</div>
                  </div>

                  <div className={`flex my-2 justify-center items-center space-x-5 `}>
                     <Button colors={"second"} onClick={handlePrevious}>
                        <BackwardIcon className="w-8" />
                     </Button>

                     <Button
                        colors={"second"}
                        className="!text-amber-200"
                        onClick={handlePlayPause}
                     >
                        {isWaiting ? (
                           <ArrowPathIcon className="w-10 animate-spin" />
                        ) : (
                           <>
                              {isPlaying ? (
                                 <PauseIcon className="w-10" />
                              ) : (
                                 <PlayIcon className="w-10" />
                              )}
                           </>
                        )}
                     </Button>

                     <Button onClick={handleNext} colors={"second"}>
                        <ForwardIcon className="w-8" />
                     </Button>
                  </div>
               </Frame>
            </div>
         </div>

         <div onWheel={handleWheel} className="fixed bottom-5 right-5">
            <Button
               className="p-2 text-amber-800"
               size={"clear"}
               onClick={handleMute}
            >
               {isMute ? (
                  <SpeakerXMarkIcon className="w-6" />
               ) : (
                  <SpeakerWaveIcon className="w-6" />
               )}
            </Button>
         </div>
      </>
   );
}
