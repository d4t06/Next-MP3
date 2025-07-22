import { formatTime } from "@/share/utils/appHelper";
import { useEffect, useRef, useState } from "react";

type Props = {
   audioEle: HTMLAudioElement;
};

export type Status = "playing" | "paused" | "waiting" | "loading" | "error";
function getLinearBg(progress: number, baseColor = "rgba(146, 64, 14, .3)") {
   return `linear-gradient(to right, #92400e ${progress}%, ${baseColor} ${progress}%, ${baseColor}`;
}

export default function useAudioControl({ audioEle }: Props) {
   const [status, setStatus] = useState<Status>("paused");
   const [isClickPlay, setIsClickPlay] = useState(false);

   const progressLineRef = useRef<HTMLDivElement>(null);
   const currentTimeRef = useRef<HTMLDivElement>(null);
   const durationRef = useRef<HTMLDivElement>(null);

   const play = () => {
      try {
         audioEle?.play();
         setIsClickPlay(true);
      } catch (error) {}
   };

   const pause = () => {
      audioEle?.pause();
   };

   const handlePlayPause = () => {
      if (status === "playing") pause();
      else if (status === "paused") play();
   };

   const handlePlaying = () => {
      setStatus("playing");
   };

   const handlePaused = () => {
      setStatus("paused");
   };

   const handleError = () => {
      setStatus("error");
   };

   const handleLoadStart = () => {
      setStatus("loading");
   };

   const handleLoaded = () => {
      setStatus("paused");

      if (durationRef.current) {
         durationRef.current.innerText = formatTime(audioEle.duration);
      }
   };

   const seek = (time: number) => {
      audioEle.currentTime = time;
   };

   const forward = (second: number) => {
      audioEle.currentTime = audioEle.currentTime + second;
   };
   const backward = (second: number) => {
      audioEle.currentTime = audioEle.currentTime - second;
   };

   const updateProgress = (progress?: number) => {
      if (!audioEle) return;

      const _progress = +(
         progress || (audioEle.currentTime / audioEle.duration) * 100
      ).toFixed(1);

      if (currentTimeRef.current)
         currentTimeRef.current.innerText = formatTime(audioEle.currentTime);

      if (progressLineRef?.current)
         progressLineRef.current.style.background = getLinearBg(_progress);
   };

   const handleSeek = (e: MouseEvent) => {
      const node = e.target as HTMLElement;

      if (progressLineRef?.current) {
         const clientRect = node.getBoundingClientRect();

         const length = e.clientX - clientRect.left;
         const lengthRatio = length / progressLineRef.current!.offsetWidth;
         const newSeekTime = Math.round(lengthRatio * audioEle.duration);

         seek(newSeekTime);
      }
   };

   const handleTimeUpdate = () => {
      const currentTime = audioEle.currentTime;
      const ratio = currentTime / (audioEle.duration / 100);

      updateProgress(+ratio.toFixed(1));
   };

   // add events listener
   useEffect(() => {
      audioEle.addEventListener("pause", handlePaused);
      audioEle.addEventListener("play", handlePlaying);
      // audioEle.addEventListener("waiting", handleWaiting);
      audioEle.addEventListener("loadstart", handleLoadStart);
      audioEle.addEventListener("loadedmetadata", handleLoaded);
      audioEle.addEventListener("error", handleError);

      if (progressLineRef?.current) {
         audioEle.addEventListener("timeupdate", handleTimeUpdate);
         progressLineRef?.current.addEventListener("click", handleSeek);
      }

      return () => {
         audioEle.removeEventListener("pause", handlePaused);
         audioEle.removeEventListener("play", handlePlaying);
         // audioEle.removeEventListener("waiting", handleWaiting);
         audioEle.removeEventListener("loadstart", handleLoadStart);
         audioEle.removeEventListener("loadedmetadata", handleLoaded);
         audioEle.removeEventListener("error", handleError);

         if (progressLineRef?.current) {
            audioEle.removeEventListener("timeupdate", handleTimeUpdate);
            progressLineRef?.current.removeEventListener("click", handleSeek);
         }
      };
   }, []);

   return {
      play,
      pause,
      seek,
      handlePlayPause,
      status,
      forward,
      backward,
      isClickPlay,
      setStatus,
      progressLineRef,
      currentTimeRef,
      durationRef,
   };
}
