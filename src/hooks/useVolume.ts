"use client";

import { getLocalStorage, setLocalStorage } from "@/share/utils/appHelper";
import { MouseEvent, RefObject, WheelEvent, useEffect, useState } from "react";
import useDebounce from "./useDebounce";

type Props = {
   volumeProcess: RefObject<HTMLDivElement>;
   audioRef: RefObject<HTMLAudioElement>;
};

export default function useVolume({ audioRef, volumeProcess }: Props) {
   const [isMute, setIsMute] = useState(false);
   const [volume, setVolume] = useState(0);

   const debounceVolume = useDebounce(volume, 500);

   const handleSetVolume = (
      e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>
   ) => {
      const node = e.target as HTMLElement;
      const clientRect = node.getBoundingClientRect();

      const volumeProcessEle = volumeProcess.current as HTMLDivElement;

      if (volumeProcessEle) {
         let newVolume = +(
            (e.clientX - clientRect.x) /
            volumeProcessEle.clientWidth
         ).toFixed(2);

         if (newVolume > 0.9) newVolume = 1;
         else if (newVolume < 0.05) {
            newVolume = 0;
            setIsMute(true);
         } else setIsMute(false);

         setVolume(newVolume);
      }
   };

   const handleWheel = (e: WheelEvent<HTMLButtonElement>) => {
      e.preventDefault();

      const FACTOR = 0.1;
      let newVolume = volume;

      // scroll down
      if (e.deltaY > 0) {
         if (newVolume - FACTOR > 0) newVolume -= FACTOR;
         else {
            newVolume = 0;
         }
      } else {
         if (newVolume + FACTOR < 1) newVolume += FACTOR;
         else {
            newVolume = 1;
         }
      }

      setVolume(+newVolume.toFixed(2));
   };

   const handleMute = () => {
      if (!audioRef.current) return;

      const newValue = !isMute;

      setIsMute(newValue);
      audioRef.current.muted = newValue;
   };

   useEffect(() => {
      const volume = getLocalStorage()["volume"];
      setVolume(+volume || 1);
   }, []);

   useEffect(() => {
      if (debounceVolume) {
         setLocalStorage("volume", debounceVolume);
      }
   }, [debounceVolume]);

   useEffect(() => {
      if (volumeProcess.current && audioRef.current) {
         const ratio = volume * 100;

         volumeProcess.current.style.background = `linear-gradient(to right, #fbbf24 ${ratio}%, white ${ratio}%, white 100%)`;
         audioRef.current.volume = volume;

         if (volume === 0) setIsMute(true);
         else setIsMute(false);
      }
   }, [volume]);

   return { volume, handleSetVolume, isMute, handleMute, handleWheel };
}
