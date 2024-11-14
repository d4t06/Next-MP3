"use client";

import { useEffect, useState } from "react";
import Control from "./Control";
import { usePlayerContext } from "@/stores/PlayerContext";

export default function Player() {
   const { currentSongRef, audioEleRef } = usePlayerContext();

   const [hadAudio, setHadAudio] = useState(false);

   useEffect(() => {
      if (audioEleRef.current) {
         setHadAudio(true);
      }
   }, []);

   return (
      <>
         <audio
            ref={audioEleRef}
            src={currentSongRef.current?.song_url}
            className="hidden"
         ></audio>

         {audioEleRef.current && hadAudio && (
            <Control audioEle={audioEleRef.current} />
         )}
      </>
   );
}
