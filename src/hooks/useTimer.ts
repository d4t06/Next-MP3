import { getLocalStorage, setLocalStorage } from "@/share/utils/appHelper";
import { useEffect, useRef, useState } from "react";

type Props = {
   isPlaying: boolean;
   audioEle: HTMLAudioElement;
};

export default function useTimer({ isPlaying, audioEle }: Props) {
   // store user timer, decide add song event or not
   const [isActive, setIsActive] = useState(0);
   const [countDown, setCountDown] = useState(0); // count down

   const isEnd = useRef(false);

   const play = async () => {
      try {
         await audioEle.play();
      } catch (error) {}
   };

   const clearTimer = (clearCountDown?: boolean) => {
      setLocalStorage("timer", 0);
      setIsActive(0);
      isEnd.current = true;

      if (clearCountDown) setCountDown(0);
   };

   const handleSongEnd = () => {
      setCountDown((prev) => {
         if (prev - 1 > 0) {
            setLocalStorage("timer", prev - 1);
            return prev - 1;
         }

         clearTimer();
         return 0;
      });
   };

   // load localStorage
   useEffect(() => {
      const timer = getLocalStorage()["timer"] || 0;
      setIsActive(timer);
      setCountDown(timer);
   }, []);

   // add audio event
   useEffect(() => {
      if (!isActive) return;

      audioEle.addEventListener("ended", handleSongEnd);

      return () => {
         audioEle.removeEventListener("ended", handleSongEnd);
      };
   }, [isActive]);

   // handle user click
   useEffect(() => {
      /** loadLocalStorage:  loadStorage() => setActive(), setCountDown() */
      /** manual: user choose timer => setIsActive() => setCountDown() */
      if (!isActive) return;

      if (!countDown) {
         setCountDown(isActive);
         setLocalStorage("timer", isActive);

         if (!isPlaying) play();
      }
   }, [isActive]);

   return { countDown, clearTimer, setCountDown, setIsActive, isActive };
}
