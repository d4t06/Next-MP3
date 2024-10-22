"use client";

import { useCurrentSong } from "@/stores/currentSongContext";
import { ElementRef, useEffect, useRef, useState } from "react";
import Control from "./Control";

type Props = {
   songs: Song[];
};

export default function Player({ songs }: Props) {
   const { currentSong } = useCurrentSong();
   const audioRef = useRef<ElementRef<"audio">>(null);

   const [hadAudio, setHadAudio] = useState(false);

   useEffect(() => {
      if (audioRef.current) setHadAudio(true);
   }, []);

   return (
      <>
         <audio
            ref={audioRef}
            src={currentSong?.song_url}
            className="hidden"
         ></audio>

         {audioRef.current && hadAudio && (
            <Control audioEle={audioRef.current} songs={songs} />
         )}
      </>
   );
}
