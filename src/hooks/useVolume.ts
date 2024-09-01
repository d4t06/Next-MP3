"use client";

import { getLocalStorage, setLocalStorage } from "@/share/utils/appHelper";
import { RefObject, WheelEvent, useEffect, useState } from "react";
import useDebounce from "./useDebounce";

type Props = {
   audioRef: RefObject<HTMLAudioElement>;
};

export default function useVolume({ audioRef }: Props) {
   const [isMute, setIsMute] = useState(false);
   const [volume, setVolume] = useState(0);

   const debounceVolume = useDebounce(volume, 500);

   const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      console.log("wheel");

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
      if (audioRef.current) {
         audioRef.current.volume = volume;

         if (volume === 0) setIsMute(true);
         else setIsMute(false);
      }
   }, [volume]);

   return { volume, isMute, handleMute, handleWheel };
}
