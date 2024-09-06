"use client";
import useControl from "@/hooks/useControl";
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
   QueueListIcon,
} from "@heroicons/react/24/outline";
import { ElementRef, useEffect, useRef, useState } from "react";
import { VolumeButton } from "./VolumeButton";
import SongItem from "./SongItem";
import TimerButton from "./TimerButton";

type Props = {
   songs: Song[];
};

type Tab = "playing" | "queue";

export default function Control({ songs }: Props) {
   const { currentSong } = useCurrentSong();

   const [tab, setTab] = useState<Tab>("playing");

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
      songs,
      currentTimeRef,
      processLineRef,
      timeHolderRef,
   });

   useEffect(() => {
      if (tab === "queue") {
         const activeSongEle = document.querySelector(".active-song-item");
         if (activeSongEle) {
            activeSongEle.scrollIntoView({
               behavior: "instant",
               block: "center",
            });
         }
      }
   }, [tab]);

   const classes = {
      timeLineRef: `relative group h-full sm:h-1 hover:h-full  w-full rounded-full bg-white/30 before:content-[''] before:w-[100%] before:h-[16px] before:absolute before:top-[50%] before:translate-y-[-50%]`,
      timeLineHolderRef:
         "absolute pointer-events-none hidden sm:block opacity-0 group-hover:opacity-[100] h-6 w-3 rounded-sm bg-amber-900 border-[2px] border-amber-200 top-1/2 -translate-y-1/2 -translate-x-1/2",
      toggleButton: "p-2 ",
   };

   return (
      <>
         <div className="">
            <audio
               ref={audioRef}
               src={currentSong?.song_url}
               className="hidden"
            ></audio>

            <div className="w-[400px] max-w-[95vw] ">
               <Frame pushAble={"clear"} className="">
                  <div className="max-h-[40vh] overflow-auto px-2 no-scrollbar">
                     <div className={` ${tab === "playing" ? "" : "hidden"} `}>
                        <div
                           className={`mt-2 rounded-md text-center text-amber-100 `}
                        >
                           <h5 className="font-bold text-2xl line-clamp-1">
                              {currentSong?.name || "..."}
                           </h5>
                           <p className="text-sm font-medium line-clamp-1">
                              {currentSong?.singer || "..."}
                           </p>
                        </div>

                        <div className="h-[6px] mt-5 mb-2 flex items-center">
                           <div
                              ref={processLineRef}
                              onClick={handleSeek}
                              className={`${classes.timeLineRef} ${
                                 !currentSong && "disabled"
                              }`}
                           >
                              <div
                                 ref={timeHolderRef}
                                 className={classes.timeLineHolderRef}
                              ></div>
                           </div>
                        </div>

                        <div className="flex justify-between items-center h-[30px] text-amber-100">
                           <div ref={currentTimeRef}>0:00</div>
                           <div>{formatTime(currentSong?.duration || 0)}</div>
                        </div>

                        <div
                           className={`flex my-2 justify-center items-center space-x-5 `}
                        >
                           <Button
                              disabled={songs.length <= 1}
                              colors={"second"}
                              onClick={handlePrevious}
                           >
                              <BackwardIcon className="w-8" />
                           </Button>

                           <Button
                              colors={"second"}
                              disabled={!songs.length}
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

                           <Button
                              disabled={songs.length <= 1}
                              onClick={handleNext}
                              colors={"second"}
                           >
                              <ForwardIcon className="w-8" />
                           </Button>
                        </div>
                     </div>

                     <div className={`${tab === "queue" ? "" : "hidden"}`}>
                        {songs.map((s, index) => (
                           <SongItem
                              key={index}
                              index={index}
                              song={s}
                              songs={songs}
                           />
                        ))}
                     </div>
                  </div>
               </Frame>
            </div>
         </div>

         <div className="absolute bottom-5 right-5 flex space-x-2">
            <TimerButton audioRef={audioRef} isPlaying={isPlaying} />

            <VolumeButton audioRef={audioRef} />

            <Button
               className={classes.toggleButton}
               size={"clear"}
               onClick={() =>
                  tab === "playing" ? setTab("queue") : setTab("playing")
               }
            >
               <QueueListIcon className="w-6" />
            </Button>
         </div>
      </>
   );
}
