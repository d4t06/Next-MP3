import { useEditLyricContext } from "@/stores/editLyricContext";
import { useRef } from "react";

type Props = {
   audioEle: HTMLAudioElement;
   isClickPlay: boolean;
};

export function useLyricAction({ audioEle, isClickPlay }: Props) {
   const end = useRef(0);
   const start = useRef(0);

   const {
      baseLyricArr,
      currentLyricIndex,
      lyrics,
      setCurrentLyricIndex,
      setLyrics,
   } = useEditLyricContext();

   const isFinish = lyrics.length >= baseLyricArr.length;

   const isNearFinish = lyrics.length === baseLyricArr.length - 1;

   const isEnableAddBtn = isClickPlay && !!baseLyricArr.length && !isFinish;

   const addLyric = () => {
      // if song no has lyric
      if (!baseLyricArr.length) return;

      if (!audioEle) return;

      // if end of the song
      if (isFinish) return;

      // if start time and end time is equal
      if (start.current == +audioEle.currentTime.toFixed(1)) return;

      if (isNearFinish) end.current = +audioEle.duration.toFixed(1);
      else end.current = +audioEle.currentTime.toFixed(1);

      const text = baseLyricArr[currentLyricIndex];

      const lyric: Lyric = {
         start: start.current,
         text,
         song_lyric_id: 0,
      };

      start.current = end.current;

      setLyrics([...lyrics, lyric]);
      setCurrentLyricIndex(currentLyricIndex + 1);
   };

   const removeLyric = () => {
      if (currentLyricIndex <= 0) return;

      if (audioEle) {
         start.current = lyrics[currentLyricIndex - 1].start;
         end.current = 0;

         const previousLyricResult = lyrics.slice(0, currentLyricIndex - 1);

         setLyrics(previousLyricResult);
         setCurrentLyricIndex(currentLyricIndex - 1);
      }
   };

   const handleSubmit = async () => {};

   return { addLyric, removeLyric, isEnableAddBtn };
}
