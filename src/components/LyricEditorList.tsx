import { RefObject, useEffect, useRef } from "react";
import { LyricEditorControlRef } from "./LyricEditorControl";
import { useEditLyricContext } from "@/stores/editLyricContext";
import LyricItem from "./LyricIitem";
import AddLyricItem from "./AddLyricItem";

type Props = {
   controlRef: RefObject<LyricEditorControlRef>;
};

export default function LyricEditorList({ controlRef }: Props) {
   const { baseLyricArr, lyrics, currentLyricIndex } = useEditLyricContext();

   const ranFirstScroll = useRef(false);

   const handleSeek = (second: number) => {
      controlRef.current?.seek(second);
   };

   const scroll = (el: Element, behavior?: ScrollOptions["behavior"]) => {
      el.scrollIntoView({
         behavior: behavior || "smooth",
         block: "center",
      });
   };

   useEffect(() => {
      if (!ranFirstScroll.current) {
         ranFirstScroll.current = false;

         const activeLyricEl = document.querySelector(".active-lyric");
         if (activeLyricEl) scroll(activeLyricEl, "instant");
      }
   }, [baseLyricArr]);

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
                           className="pt-[24px] pb-[10px] mr-[24px]"
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
