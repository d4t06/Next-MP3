import { useEditLyricContext } from "@/stores/editLyricContext";
import { useRef } from "react";

type Props = {
   audioEle: HTMLAudioElement;
   isClickPlay: boolean;
};

export function useLyricAction({ audioEle, isClickPlay }: Props) {
   // const end = useRef(0);
   const start = useRef(0);

   const {
      baseLyricArr,
      currentLyricIndex,
      lyrics,
      setCurrentLyricIndex,
      setLyrics,
      setIsChanged,
   } = useEditLyricContext();

   const isFinish = lyrics.length >= baseLyricArr.length;

   const isEnableAddBtn = isClickPlay && !!baseLyricArr.length && !isFinish;

   const addLyric = () => {
      if (!audioEle || !baseLyricArr.length || isFinish) return;
      const currentTime = +audioEle.currentTime.toFixed(1);

      if (start.current === currentTime) return; // prevent double click

      const text = baseLyricArr[currentLyricIndex];
      const lyric: Lyric = {
         start: start.current, // end time of prev lyric
         text,
      };

      console.log("next lyric start", currentTime);

      start.current = currentTime; // update start for next lyric

      setLyrics([...lyrics, lyric]);
      setCurrentLyricIndex(currentLyricIndex + 1);

      setIsChanged(true);
   };

   const removeLyric = () => {
      if (currentLyricIndex <= 0) return;

      if (audioEle) {
         const prevStart = lyrics[currentLyricIndex - 1].start;

         start.current = prevStart;
         audioEle.currentTime = prevStart;

         setLyrics((prev) => prev.slice(0, -1));
         setCurrentLyricIndex((prev) => prev - 1);
         setIsChanged(true);
      }
   };

   return { addLyric, removeLyric, isEnableAddBtn };
}
