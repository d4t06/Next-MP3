"use client";

import { getLocalStorage, setLocalStorage } from "@/share/utils/appHelper";
import { MouseEvent, RefObject, WheelEvent, useEffect, useState } from "react";
import useDebounce from "./useDebounce";

type Props = {
   audioRef: RefObject<HTMLAudioElement>;
   volumeLineRef: RefObject<HTMLDivElement>;
   volumeHolderRef: RefObject<HTMLDivElement>;
};

export default function useVolume({ audioRef, volumeHolderRef, volumeLineRef }: Props) {
   const [isMute, setIsMute] = useState(false);
   const [volume, setVolume] = useState(0);

   const debounceVolume = useDebounce(volume, 500);

   const handleSetVolume = (e: MouseEvent<HTMLDivElement>) => {
      const node = e.target as HTMLElement;
      const clientRect = node.getBoundingClientRect();

      const volumeLineEle = volumeLineRef.current as HTMLDivElement;

      console.log(e.clientY, clientRect.y);

      if (volumeLineEle) {
         let newVolume = +(
            (volumeLineEle.clientHeight - (e.clientY - clientRect.y)) /
            volumeLineEle.clientHeight
         ).toFixed(2);

         if (newVolume > 0.9) newVolume = 1;
         else if (newVolume < 0.05) {
            newVolume = 0;
            setIsMute(true);
         } else setIsMute(false);

         setVolume(newVolume);
      }
   };

   const handleWheel = (e: WheelEvent) => {
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
      setIsMute(!isMute);
      // setLocalStorage("volume", !isMute ? 0 : 1);
   };

   useEffect(() => {
      const volume = getLocalStorage()["volume"];
      setVolume(isNaN(+volume) ? 1 : +volume);
   }, []);

   useEffect(() => {
      if (!audioRef.current) return;
      audioRef.current.muted = isMute;
   }, [isMute]);

   useEffect(() => {
      if (debounceVolume) {
         setLocalStorage("volume", debounceVolume);
      }
   }, [debounceVolume]);

   useEffect(() => {
      if (audioRef.current && volumeLineRef.current && volumeHolderRef.current) {
         const ratio = volume * 100;

         audioRef.current.volume = volume;
         volumeLineRef.current.style.background = `linear-gradient(to top, rgb(253, 230, 138) ${ratio}%, white ${ratio}%, white 100%)`;
         volumeHolderRef.current.style.bottom = `${ratio}%`;

         if (volume === 0) setIsMute(true);
         else setIsMute(false);
      }
   }, [volume]);

   return { volume, isMute, handleMute, handleWheel, handleSetVolume };
}
