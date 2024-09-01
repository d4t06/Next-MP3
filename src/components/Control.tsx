"use client";

import useControl from "@/hooks/useControl";
import useVolume from "@/hooks/useVolume";
import Button from "@/share/_components/Button";
import Frame from "@/share/_components/Frame";
import { formatTime } from "@/share/utils/appHelper";
import { useCurrentSong } from "@/stores/currentSongContext";
import {
   ArrowPathIcon,
   ArrowTrendingUpIcon,
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
   const audioRef = useRef<ElementRef<"audio">>(null);
   const currentTimeRef = useRef<ElementRef<"div">>(null);
   const volumeProcess = useRef<ElementRef<"div">>(null);

   const {
      handleNext,
      handlePlayPause,
      handlePrevious,
      handleSeek,
      isWaiting,
      isPlaying,
   } = useControl({
      audioRef,
      currentTimeRef,
      processLineRef,
   });

   const { handleMute, handleSetVolume, handleWheel, isMute, volume } =
      useVolume({ audioRef, volumeProcess });

   return (
      <div className="fixed bottom-5 left-0 right-0">
         <audio
            ref={audioRef}
            src={currentSong?.song_url}
            className="hidden"
         ></audio>

         <div className="container">
            <Frame pushAble={"clear"}>
               <div className="flex items-center justify-between sm:space-x-4 ">
                  <div className="w-full sm:w-1/4  bg-amber-200 rounded-md p-2 text-amber-800">
                     <h5 className="font-medium line-clamp-1">
                        {currentSong?.name || "Song name"}
                     </h5>
                     <p className="text-sm font-medium line-clamp-1">
                        {currentSong?.singer || "..."}
                     </p>
                  </div>

                  <div
                     className={`flex flex-col sm:flex-grow max-w-[400px] ${
                        !currentSong && "disabled"
                     }`}
                  >
                     <div className={`"cta flex justify-center space-x-4 `}>
                        <button
                           onClick={handlePrevious}
                           className="text-amber-200 hidden sm:block"
                        >
                           <BackwardIcon className="w-7" />
                        </button>

                        {/* <button className="text-amber-200 hidden sm:block">
                           <ArrowTrendingUpIcon className="w-7" />
                        </button> */}

                        <Button
                           onClick={handlePlayPause}
                           size={"clear"}
                           className="p-1"
                        >
                           {isWaiting ? (
                              <ArrowPathIcon className="w-9 animate-spin" />
                           ) : (
                              <>
                                 {isPlaying ? (
                                    <PauseIcon className="w-9" />
                                 ) : (
                                    <PlayIcon className="w-9" />
                                 )}
                              </>
                           )}
                        </Button>

                        <button onClick={handleNext} className="text-amber-200">
                           <ForwardIcon className="w-7" />
                        </button>

                        {/* <button className="text-amber-200 hidden sm:block">
                           <ArrowPathIcon className="w-7" />
                        </button> */}
                     </div>
                     <div className="hidden sm:flex items-center h-[30px] text-amber-200 space-x-1 ">
                        <div ref={currentTimeRef} className="">
                           0:00
                        </div>
                        <div
                           ref={processLineRef}
                           onClick={handleSeek}
                           className="h-1 hover:h-2 w-full rounded-full bg-white"
                        ></div>
                        <span>{formatTime(currentSong?.duration || 0)}</span>
                     </div>
                  </div>

                  <div className="hidden sm:flex w-1/4 items-center max-w-[140px] flex-grow space-x-1">
                     <button onWheel={handleWheel} onClick={handleMute}>
                        {isMute ? (
                           <SpeakerXMarkIcon className="w-8 text-amber-200" />
                        ) : (
                           <SpeakerWaveIcon className="w-8 text-amber-200" />
                        )}
                     </button>
                     <div
                        ref={volumeProcess}
                        onClick={handleSetVolume}
                        className="h-1 hover:h-2 w-full rounded-full bg-white"
                     ></div>
                  </div>
               </div>
            </Frame>
         </div>
      </div>
   );
}
