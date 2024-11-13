import { useEffect, useState } from "react";

type Props = {
   audioEle: HTMLAudioElement;
};

export type Status = "playing" | "paused" | "waiting" | "loading" | "error";

export default function useAudioControl({ audioEle }: Props) {
   const [status, setStatus] = useState<Status>("paused");
   const [isClickPlay, setIsClickPlay] = useState(false);

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

   const handleWaiting = () => {
      setStatus("waiting");
   };

   const handleLoadStart = () => {
      setStatus("loading");
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

   // add events listener
   useEffect(() => {
      audioEle.addEventListener("pause", handlePaused);
      audioEle.addEventListener("play", handlePlaying);
      audioEle.addEventListener("waiting", handleWaiting);
      audioEle.addEventListener("loadstart", handleLoadStart);

      return () => {
         audioEle.removeEventListener("pause", handlePaused);
         audioEle.removeEventListener("play", handlePlaying);
         audioEle.removeEventListener("waiting", handleWaiting);
         audioEle.removeEventListener("loadstart", handleLoadStart);
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
   };
}
