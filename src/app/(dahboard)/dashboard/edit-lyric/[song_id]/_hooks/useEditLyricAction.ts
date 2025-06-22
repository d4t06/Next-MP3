import { getLocalStorage, setLocalStorage } from "@/share/utils/appHelper";
import { useEditLyricContext } from "../_components/EditLyricContext";
import { useEffect, useState } from "react";

type Props = {
   audioEle: HTMLAudioElement;
   isClickPlay: boolean;
};

export function useLyricAction({ audioEle, isClickPlay }: Props) {
   const [speed, setSpeed] = useState(1);
   const [volume, setVolume] = useState(100);

   const {
      start,
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
         end: currentTime,
      };

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

   const changeSpeed = (speed: number) => {
      audioEle.playbackRate = speed;
      setSpeed(speed);
      setLocalStorage("edit_lyric_audio_speed", speed);
   };

   const changeVolume = (value: number) => {
      audioEle.volume = value / 100;
      setVolume(value);
      setLocalStorage("edit_lyric_audio_volume", value);
   };

   useEffect(() => {
      const { edit_lyric_audio_speed, edit_lyric_audio_volume } =
         getLocalStorage();

      if (edit_lyric_audio_speed) {
         setSpeed(+edit_lyric_audio_speed);
         audioEle.playbackRate = +edit_lyric_audio_speed;
      }
      if (edit_lyric_audio_volume) {
         setVolume(+edit_lyric_audio_volume);
         audioEle.volume = +edit_lyric_audio_volume / 100;
      }
   }, []);

   return {
      addLyric,
      removeLyric,
      isEnableAddBtn,
      speed,
      volume,
      changeSpeed,
      changeVolume,
   };
}
