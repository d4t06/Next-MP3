"use client";

import { ElementRef, useEffect, useRef, useState } from "react";
import LyricEditorControl, {
   LyricEditorControlRef,
} from "./LyricEditorControl";
import { useEditLyricContext } from "@/stores/editLyricContext";
import LyricEditorList from "./LyricEditorList";
import Button from "@/share/_components/Button";

type Props = {
   songWithLyric: SongWithLyric;
};

export default function LyricEditor({ songWithLyric }: Props) {
   const [_hasAudioEle, setHasAudioEle] = useState(false);

   const {
      baseLyric,
      setBaseLyricArr,
      setBaseLyric,
      setLyrics,
      setCurrentLyricIndex,
      lyrics,
   } = useEditLyricContext();

   const audioRef = useRef<ElementRef<"audio">>(null);
   const controlRef = useRef<LyricEditorControlRef>(null);

   useEffect(() => {
      if (audioRef.current) setHasAudioEle(true);
      setCurrentLyricIndex(lyrics.length);

      if (songWithLyric.song_lyric) {
         setBaseLyric(songWithLyric.song_lyric.base_lyric);

         const parsedLyric = JSON.parse(songWithLyric.song_lyric.lyrics);
         setLyrics(parsedLyric);
      }
   }, []);

   //    update base lyric array
   useEffect(() => {
      if (!baseLyric) return;

      const filteredLyric = baseLyric.split(/\r?\n/).filter((l) => l);
      setBaseLyricArr(filteredLyric);
   }, [baseLyric]);

   return (
      <div className="flex flex-col h-full">
         <audio
            ref={audioRef}
            src={songWithLyric.song_url}
            className="hidden"
         ></audio>

         <h1 className="text-xl mt-5 text-amber-800">
            Edit lyric - {songWithLyric.name}
         </h1>

         {audioRef.current && (
            <>
               <LyricEditorControl
                  ref={controlRef}
                  audioEle={audioRef.current}
               />

               <LyricEditorList controlRef={controlRef} />

               <div className="flex mb-5">
                  <Button colors={"second"}>Save</Button>
               </div>
            </>
         )}
      </div>
   );
}
