import { RefObject, useEffect, useRef } from "react";
import { LyricEditorControlRef } from "./LyricEditorControl";
import { useEditLyricContext } from "./EditLyricContext";
import AddLyricItem from "./AddLyricItem";
import LyricItem, { LyricStatus } from "@/components/song-lyric/LyricItem";
import useLyric from "@/components/song-lyric/useSongLyric";
import { setLocalStorage } from "@/share/utils/appHelper";
import useEditorList from "../_hooks/useEditorList";

type Props = {
   controlRef: RefObject<LyricEditorControlRef>;
};

export default function LyricEditorList({ controlRef }: Props) {
   const { baseLyricArr, lyrics, audioRef, currentLyricIndex, isPreview } =
      useEditLyricContext();

   if (!audioRef.current) return <></>;

   const ranFirstScroll = useRef(false);

   const { currentIndex, lyricRefs } = useLyric({
      audioEle: audioRef.current,
      isActive: isPreview,
      lyrics,
   });

   const { lyricRefs: _lyricRefs } = useEditorList();

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

   useEffect(() => {
      setLocalStorage("edit_current-lyric-index", currentIndex);
   }, [currentIndex]);

   return (
      <div className="flex flex-grow overflow-auto text-sm no-scrollbar mb-5 bg-amber-800 rounded-xl mt-3 py-2 text-lg font-[700] text-amber-100">
         <div className={`w-1/2 px-2 ${isPreview ? "hidden" : ""}`}>
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
                           className="pt-[28px] pb-2 mr-[24px] last:mb-[30vh]"
                           key={index}
                           status={status}
                           text={lyric}
                           getPRef={(el) => (_lyricRefs.current[index] = el)}
                        />
                     );
                  })}
               </>
            ) : (
               <p>...</p>
            )}
         </div>

         <div className={` px-2 ${isPreview ? "text-center w-full" : "w-1/2"}`}>
            {!!lyrics?.length &&
               lyrics.map((lyric, index) => {
                  let status: LyricStatus = "coming";

                  if (isPreview) {
                     if (currentIndex === index) status = "active";
                     else if (index < currentIndex) status = "done";
                  }

                  return (
                     <AddLyricItem
                        setPRef={(ele) => (lyricRefs.current[index] = ele!)}
                        seek={handleSeek}
                        lyric={lyric}
                        key={index}
                        status={status}
                        isPreview={isPreview}
                        index={index}
                     />
                  );
               })}
         </div>
      </div>
   );
}
