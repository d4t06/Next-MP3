import {
   formatTime,
   getLocalStorage,
   setLocalStorage,
} from "@/share/utils/appHelper";
import { MouseEventHandler, RefObject, useEffect, useRef } from "react";
import useAudioControl, { Status } from "./useAudioControl";
import { usePlayerContext } from "@/stores/PlayerContext";

type Props = {
   audioEle: HTMLAudioElement;
   processLineRef: RefObject<HTMLDivElement>;
   currentTimeRef: RefObject<HTMLDivElement>;
   timeHolderRef: RefObject<HTMLDivElement>;
};

export default function useControl({
   audioEle,
   currentTimeRef,
   processLineRef,
   timeHolderRef,
}: Props) {
   const { songs, currentIndex, setCurrentSong, currentSongRef } =
      usePlayerContext();

   const firstTimeSongLoaded = useRef(true);
   const isPlayAllSong = useRef(false); // use for end event
   const currentIndexRef = useRef<number | null>(null); // use for audio event handler
   const statusRef = useRef<Status>("paused");

   const { play, pause, handlePlayPause, status, setStatus } = useAudioControl({
      audioEle: audioEle,
   });

   const _handlePlayPause = () => {
      if (firstTimeSongLoaded.current) {
         audioEle.currentTime = getLocalStorage()["current_time"] || 0;
         firstTimeSongLoaded.current = false;
      }

      handlePlayPause();
   };

   const resetUI = () => {
      if (
         processLineRef.current &&
         currentTimeRef.current &&
         timeHolderRef.current
      ) {
         currentTimeRef.current.innerText = "0:00";
         processLineRef.current.style.background = "rgba(255,255,255,.3)";
         timeHolderRef.current.style.left = "0";
      }
   };

   const handleSeek = <MouseEventHandler>function (e) {
      if (!audioEle) return;
      const node = e.target as HTMLElement;

      if (processLineRef.current) {
         const clientRect = node.getBoundingClientRect();

         const length = e.clientX - clientRect.left;
         const lengthRatio = length / processLineRef.current.clientWidth;
         const newSeekTime = lengthRatio * audioEle.duration;

         updateTimeProgressEle(newSeekTime);
         if (firstTimeSongLoaded.current) {
            setLocalStorage("current_time", newSeekTime);
         } else {
            audioEle.currentTime = newSeekTime;
         }
      }
   };

   const handleNext = () => {
      if (currentIndexRef.current === null) return;

      let newIndex = currentIndexRef.current + 1;

      if (newIndex >= songs.length) newIndex = 0;

      setCurrentSong(newIndex);
   };

   const handlePrevious = () => {
      if (currentIndexRef.current === null) return;

      let newIndex = currentIndexRef.current - 1;
      if (newIndex < 0) newIndex = songs.length - 1;

      setCurrentSong(newIndex);
   };

   const updateTimeProgressEle = (time: number) => {
      const timeLine = processLineRef.current;
      const timeLineHolder = timeHolderRef.current;
      const currentTimeEle = currentTimeRef.current;

      if (audioEle.duration && timeLineHolder && timeLine) {
         const ratio = time / (audioEle.duration / 100);
         timeLine.style.background = `linear-gradient(to right, #fde68a ${ratio}%, rgba(255,255,255, .3) ${ratio}%, rgba(255,255,255, .3) 100%)`;
         timeLineHolder.style.left = `${ratio}%`;
      }

      if (currentTimeEle) currentTimeEle.innerText = formatTime(time) || "0:00";
   };

   const handleTimeUpdate = () => {
      if (!audioEle) return;
      const currentTime = audioEle?.currentTime;

      if (statusRef.current !== "paused") setStatus("playing");
      updateTimeProgressEle(currentTime);

      // set localStorage
      if (Math.round(currentTime) % 3 === 0)
         setLocalStorage("current_time", Math.round(currentTime));
   };

   const handleEnded = () => {
      if (songs.length === 1) return setStatus("paused");

      const timer = getLocalStorage()["timer"];

      if (!!timer) {
         // user modified local storage
         if (timer < 1) {
            setLocalStorage("timer", 0);
            return setStatus("paused");
         } else if (timer > 1) {
            return handleNext();
         }
      }

      if (
         (!!timer && timer === 1) ||
         currentIndexRef.current === songs.length - 1
      ) {
         isPlayAllSong.current = true;
      }

      return handleNext();
   };

   const handleError = () => {
      if (firstTimeSongLoaded.current) return;
      if (songs.length > 1) {
         handleNext();
      } else setStatus("paused");
   };

   const handleLoaded = () => {
      if (isPlayAllSong.current) {
         isPlayAllSong.current = false;
         return setStatus("paused");
      }

      if (currentSongRef.current) {
         setLocalStorage("current", currentSongRef.current.id);
      }

      if (firstTimeSongLoaded.current) {
         const storage = getLocalStorage();

         setStatus("paused");

         const currentTime = storage["current_time"] || 0;
         updateTimeProgressEle(currentTime);
         return;
      }

      play();
   };

   // init song from local storage
   useEffect(() => {
      const storage = getLocalStorage();
      const current = storage["current"];

      if (current) {
         if (songs.length) {
            const index = songs.findIndex((s) => s.id === current);
            if (index !== -1) setCurrentSong(index);
         }
      }
   }, []);

   // add events listener
   useEffect(() => {
      if (!audioEle) {
         console.log("Audio element is undefined in use control");
         return;
      }

      audioEle.addEventListener("error", handleError);
      audioEle.addEventListener("timeupdate", handleTimeUpdate);
      audioEle.addEventListener("ended", handleEnded);
      audioEle.addEventListener("loadedmetadata", handleLoaded);

      return () => {
         audioEle?.removeEventListener("error", handleError);
         audioEle?.removeEventListener("timeupdate", handleTimeUpdate);
         audioEle?.removeEventListener("ended", handleEnded);
         audioEle?.removeEventListener("loadedmetadata", handleLoaded);
      };
   }, []);

   useEffect(() => {
      if (!audioEle) return;

      currentIndexRef.current = currentIndex;
      pause();

      return () => {
         resetUI();
      };
   }, [currentIndex]);

   useEffect(() => {
      statusRef.current = status;
   }, [status]);

   const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === " ") {
         e.preventDefault();
         e.stopPropagation();

         if (currentIndexRef.current !== null) {
            if (statusRef.current === "playing") pause();
            else if (statusRef.current === "paused") play();
         }
      }
   };

   useEffect(() => {
      document.addEventListener("keydown", handleKeyDown);

      return () => {
         document.removeEventListener("keydown", handleKeyDown);
      };
   }, []);

   return {
      handleNext,
      handleSeek,
      handlePrevious,
      handlePlayPause: _handlePlayPause,
      status,
      statusRef,
   };
}
