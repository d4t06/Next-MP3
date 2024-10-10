"use client";

import { useRef } from "react";
import LyricEditorControl, {
   LyricEditorControlRef,
} from "./LyricEditorControl";
import LyricEditorList from "./LyricEditorList";
import Button from "@/share/_components/Button";
import useLyricEditor from "@/hooks/useLyricEditor";

type Props = {
   songWithLyric: SongWithLyric;
};

export default function LyricEditor({ songWithLyric }: Props) {
   const controlRef = useRef<LyricEditorControlRef>(null);

   const { audioRef, isChanged, isFetching, handleAddLyric } = useLyricEditor({
      songWithLyric,
   });

   return (
      <div className="flex flex-col h-full">
         <audio
         controls
            ref={audioRef}
            src={songWithLyric.song_url}
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
                  <Button
                     disabled={!isChanged}
                     onClick={handleAddLyric}
                     loading={isFetching}
                     colors={"second"}
                  >
                     Save
                  </Button>
               </div>
            </>
         )}
      </div>
   );
}
