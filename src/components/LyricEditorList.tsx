import { RefObject } from "react";
import { LyricEditorControlRef } from "./LyricEditorControl";
import { useEditLyricContext } from "@/stores/editLyricContext";
import LyricItem from "./LyricIitem";
import AddLyricItem from "./AddLyricItem";

type Props = {
   controlRef: RefObject<LyricEditorControlRef>;
};

export default function LyricEditorList({ controlRef }: Props) {
   const { baseLyricArr, lyrics, currentLyricIndex } = useEditLyricContext();

   const handleSeek = (second: number) => {
      controlRef.current?.seek(second);
   };

   return (
      <div className="flex flex-grow overflow-auto mb-5 bg-amber-800 rounded-xl mt-3 py-2 text-amber-100">
         <div className={"w-1/2 px-2"}>
            {!!baseLyricArr.length ? (
               <>
                  {baseLyricArr.map((lyric, index) => {
                     const status =
                        index === currentLyricIndex
                           ? "active"
                           : index < currentLyricIndex
                           ? "done"
                           : "coming";
                     return (
                        <LyricItem
                           className="pb-[34px] leading-[1.2] mr-[24px]"
                           key={index}
                           status={status}
                           text={lyric}
                        />
                     );
                  })}
               </>
            ) : (
               <h1>Base lyric...</h1>
            )}
         </div>

         <div className={"w-1/2 px-2"}>
            {!!lyrics?.length &&
               lyrics.map((lyric, index) => (
                  <AddLyricItem
                     seek={handleSeek}
                     lyric={lyric}
                     key={index}
                     index={index}
                  />
               ))}
         </div>
      </div>
   );
}
