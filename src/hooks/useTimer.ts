import { getLocalStorage, setLocalStorage } from "@/share/utils/appHelper";
import { RefObject, useEffect, useRef, useState } from "react";

type Props = {
   audioEle: HTMLAudioElement
   isPlaying: boolean;
};
export default function useTimer({ audioEle, isPlaying }: Props) {
   const [isActive, setIsActive] = useState(0);
   const [countDown, setCountDown] = useState(0);

   const timerId = useRef<NodeJS.Timeout>();

   const handleEndTimer = (clearCountDown?: boolean) => {
      setIsActive(0);
      setLocalStorage("timer", 0);
      clearInterval(timerId.current);
      if (clearCountDown) setCountDown(0);
   };

   useEffect(() => {
      if (!isActive) return;

      if (!countDown) {
         setCountDown(isActive);
         if (!isPlaying) audioEle?.play();
      } else if (!isPlaying) return;

      timerId.current = setInterval(
         () =>
            setCountDown((prev) => {
               if (prev === 1) {
                  audioEle?.pause();
                  handleEndTimer();

                  return 0;
               }

               if (prev === isActive || prev % 5 === 0)
                  setLocalStorage("timer", prev - 1);

               return prev - 1;
            }),
         1000
      );

      return () => {
         clearInterval(timerId.current);
      };
   }, [isPlaying, isActive]);

   useEffect(() => {
      const timer = getLocalStorage()["timer"] || 0;
      setIsActive(timer);
      setCountDown(timer);
   }, []);

   return { countDown, setIsActive, handleEndTimer, isActive };
}
