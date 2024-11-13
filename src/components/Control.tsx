"use client";
import useControl from "@/hooks/useControl";
import Button from "@/share/_components/Button";
import Frame from "@/share/_components/Frame";
import { formatTime } from "@/share/utils/appHelper";
import {
   ArrowPathIcon,
   BackwardIcon,
   ExclamationCircleIcon,
   ForwardIcon,
   PauseIcon,
   PlayIcon,
   QueueListIcon,
} from "@heroicons/react/24/outline";
import { ElementRef, useRef, useState } from "react";
import { VolumeButton } from "./VolumeButton";
import TimerButton from "./TimerButton";
// import ScrollText from "./ScrollText";
import SongListContainer from "./SongList";
import Tooltip from "@/share/_components/Tooltip";
import SongInfoAndLyric from "./SongInfoAndLyric";
import { usePlayerContext } from "@/stores/PlayerContext";

type Props = {
   audioEle: HTMLAudioElement;
};

type Tab = "playing" | "queue";

export default function Control({ audioEle }: Props) {
   // const { currentSong } = useCurrentSong();
   const { songs, currentIndex, currentSongRef, setCurrentSong } =
      usePlayerContext();

   const [tab, setTab] = useState<Tab>("playing");

   const processLineRef = useRef<ElementRef<"div">>(null);
   const timeHolderRef = useRef<ElementRef<"div">>(null);
   const currentTimeRef = useRef<ElementRef<"div">>(null);
   const queueButtonRef = useRef<ElementRef<"button">>(null);

   const { handleNext, handlePlayPause, handlePrevious, handleSeek, status } =
      useControl({
         audioEle,
         currentTimeRef,
         processLineRef,
         timeHolderRef,
      });

   const _handlePlayPause = () => {
      if (currentIndex === null) {
         setCurrentSong(Math.round(Math.random() * songs.length));
         handlePlayPause();
      } else handlePlayPause();
   };

   const renderPlayButton = () => {
      switch (status) {
         case "playing":
            return <PauseIcon className="w-10" />;

         case "paused":
            return <PlayIcon className="w-10" />;

         case "waiting":
         case "loading":
            return <ArrowPathIcon className="w-10 animate-spin" />;
         case "error":
            return <ExclamationCircleIcon className="w-10" />;
      }
   };

   const classes = {
      timeLineRef: `relative group h-full sm:h-1 hover:h-full  w-full rounded-full bg-white/30 before:content-[''] before:w-[100%] before:h-[16px] before:absolute before:top-[50%] before:translate-y-[-50%]`,
      timeLineHolderRef:
         "absolute pointer-events-none hidden sm:block opacity-0 group-hover:opacity-[100] h-6 w-3 rounded-sm bg-amber-900 border-[2px] border-amber-200 top-1/2 -translate-y-1/2 -translate-x-1/2",
      toggleButton: "queue-btn p-2 ",
   };

   return (
      <>
         <title>{currentSongRef.current?.name || "Next MP3"}</title>
         <div className="">
            <div className="w-[500px] max-w-[95vw] ">
               <Frame pushAble={"clear"} className="">
                  <div className="px-2">
                     <div
                        className={` ${
                           tab === "playing"
                              ? "opacity-100 h-auto"
                              : "opacity-0 pointer-events-none h-0"
                        } `}
                     >
                        <SongInfoAndLyric audioEle={audioEle} />

                        <div className="h-[6px] mt-5 mb-2 flex items-center">
                           <div
                              ref={processLineRef}
                              onClick={handleSeek}
                              className={`${classes.timeLineRef} ${
                                 currentIndex === null && "disabled"
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
                           <div>
                              {formatTime(
                                 currentSongRef.current?.duration || 0
                              )}
                           </div>
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
                              onClick={_handlePlayPause}
                           >
                              {renderPlayButton()}
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

                     <div
                        className={` ${
                           tab === "queue"
                              ? "opacity-100 h-auto"
                              : "opacity-0 pointer-events-none h-0"
                        } `}
                     >
                        <SongListContainer
                           tab={tab}
                           back={() => setTab("playing")}
                           songs={songs}
                        />
                     </div>
                  </div>
               </Frame>
            </div>
         </div>

         <div className="absolute bottom-8 right-8 flex space-x-2">
            <TimerButton
               disable={!currentIndex}
               audioEle={audioEle}
               isPlaying={status === "playing"}
            />

            <VolumeButton audioEle={audioEle} />

            <Tooltip content={tab === "playing" ? "Queue" : "Playing"}>
               <Button
                  ref={queueButtonRef}
                  className={classes.toggleButton}
                  size={"clear"}
                  onClick={() =>
                     tab === "playing" ? setTab("queue") : setTab("playing")
                  }
               >
                  <QueueListIcon className="w-6" />
               </Button>
            </Tooltip>
         </div>
      </>
   );
}
