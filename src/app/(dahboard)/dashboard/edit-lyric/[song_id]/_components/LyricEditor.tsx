"use client";

import { useRef } from "react";
import LyricEditorControl, {
   LyricEditorControlRef,
} from "./LyricEditorControl";
import LyricEditorList from "./LyricEditorList";
import Button from "@/share/_components/Button";
import useLyricEditorEffect from "../_hooks/useLyricEditorEffect";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { useEditLyricContext } from "./EditLyricContext";

type Props = {
   songWithLyric: SongWithLyric;
};

export default function LyricEditor({ songWithLyric }: Props) {
   const { audioRef, isChanged } = useEditLyricContext();

   const controlRef = useRef<LyricEditorControlRef>(null);

   const { isFetching, handleAddLyric } = useLyricEditorEffect({
      songWithLyric,
      controlRef,
   });

   return (
      <>
         <div className="flex flex-col h-full">
            <audio className="hidden" ref={audioRef}></audio>

            <div className="flex items-center mt-3">
               <Button
                  size={"clear"}
                  className="self-start py-1 px-2 space-x-1"
                  href="/dashboard"
               >
                  <ChevronLeftIcon className="w-5" />
                  <span>Dashboard</span>
               </Button>
               <h1 className="line-clamp-1 text-xl ml-5 text-amber-800">
                  {songWithLyric.name}
               </h1>
            </div>

            {audioRef.current && (
               <>
                  <div className="mt-5">
                     <LyricEditorControl ref={controlRef} />
                  </div>

                  <LyricEditorList controlRef={controlRef} />

                  <Button
                     className="self-start mb-5"
                     disabled={!isChanged}
                     onClick={handleAddLyric}
                     loading={isFetching}
                     colors={"second"}
                  >
                     Save
                  </Button>
               </>
            )}
         </div>
      </>
   );
}
