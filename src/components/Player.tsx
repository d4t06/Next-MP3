"use client";

import { ElementRef, useEffect, useRef, useState } from "react";
import Control from "./Control";
import { usePlayerContext } from "@/stores/PlayerContext";

export default function Player() {
   const { currentSongRef } = usePlayerContext();
   const audioRef = useRef<ElementRef<"audio">>(null);

   const [hadAudio, setHadAudio] = useState(false);

   useEffect(() => {
      if (audioRef.current) setHadAudio(true);
   }, []);

   return (
      <>
         <audio
            ref={audioRef}
            src={currentSongRef.current?.song_url}
            className="hidden"
         ></audio>

         {audioRef.current && hadAudio && (
            <Control audioEle={audioRef.current}  />
         )}
      </>
   );
}
