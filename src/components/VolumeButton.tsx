"use client";

import useVolume from "@/hooks/useVolume";
import Button from "@/share/_components/Button";
import { SpeakerWaveIcon, SpeakerXMarkIcon } from "@heroicons/react/24/outline";

export function VolumeButton() {
   const { handleMute, handleWheel, handleSetVolume, isMute, refs } =
      useVolume();

   const classes = {
      wrapper: `volume-btn-wrapper group relative
      before:content-[''] before:w-[100%] before:h-1 before:absolute before:bottom-[100%] `,
      volumeLineContainer:
         "absolute hidden sm:flex opacity-0 pointer-events-none group-hover:pointer-events-auto group-hover:opacity-100 hover:opacity-100 hover:pointer-events-auto transition-opacity  bottom-[calc(100%+4px)] rounded-lg w-[100%] h-[100px] bg-amber-800 justify-center py-3",
      volumeLine:
         "w-1 cursor-pointer relative bg-amber-100 h-full rounded-full before:content-[''] before:w-4 before:h-full before:absolute before:-translate-x-1/2 before:left-1/2",
      volumeHolder:
         "absolute pointer-events-none hidden sm:block h-3 w-5 rounded-sm bg-amber-900 border-[2px] border-amber-200 left-1/2 -translate-x-1/2 translate-y-1/2",
   };

   return (
      <div onWheel={handleWheel} className={classes.wrapper}>
         <div className={classes.volumeLineContainer}>
            <div
               onClick={handleSetVolume}
               ref={refs.volumeLineRef}
               className={classes.volumeLine}
            >
               <div
                  ref={refs.volumeHolderRef}
                  className={classes.volumeHolder}
               ></div>
            </div>
         </div>
         <Button
            className="p-2 text-amber-800"
            size={"clear"}
            onClick={handleMute}
         >
            {isMute ? (
               <SpeakerXMarkIcon className="w-6 pointer-events-none" />
            ) : (
               <SpeakerWaveIcon className="w-6 pointer-events-none" />
            )}
         </Button>
      </div>
   );
}
