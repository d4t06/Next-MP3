import {
   formatTime,
   getLocalStorage,
   setLocalStorage,
} from "@/share/utils/appHelper";
import { useCurrentSong } from "@/stores/currentSongContext";
import { MouseEventHandler, RefObject, useEffect, useRef } from "react";
import useAudioControl from "./useAudioControl";

type Props = {
   audioEle: HTMLAudioElement;
   processLineRef: RefObject<HTMLDivElement>;
   currentTimeRef: RefObject<HTMLDivElement>;
   timeHolderRef: RefObject<HTMLDivElement>;
   songs: Song[];
};

export default function useControl({
   audioEle,
   songs,
   currentTimeRef,
   processLineRef,
   timeHolderRef,
}: Props) {
   const { currentIndex, setCurrentSong, currentSong, from } = useCurrentSong();

   const firstTimeSongLoaded = useRef(true);
   const isPlayAllSong = useRef(false); // use for end event
   const currentIndexRef = useRef<number | undefined>(undefined); // use for audio event handler
   const currentSongRef = useRef<Song | null>(null); // use for audio event handler
   const isPlayingRef = useRef(false); // for document.keydown event

   const { play, pause, handlePlayPause, status, setStatus } = useAudioControl({
      audioEle: audioEle,
   });

   const _handlePlayPause = () => {
      if (firstTimeSongLoaded.current) {
         audioEle.currentTime = getLocalStorage()["timeProcess"] || 0;
         firstTimeSongLoaded.current = false;
      }

      handlePlayPause();
   };

   const handleResetForNewSong = () => {
      setStatus("waiting");
      firstTimeSongLoaded.current = false;

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

         audioEle.currentTime = newSeekTime;
         handleTimeUpdate();
      }
   };

   const handleNext = () => {
      if (currentIndexRef.current === undefined) return;

      let newIndex = currentIndexRef.current + 1;
      let newSong: Song;

      if (newIndex < songs.length) {
         newSong = songs[newIndex];
      } else {
         newIndex = 0;
         newSong = songs[0];
      }

      setCurrentSong({
         song: newSong,
         from: "songs",
         index: newIndex,
      });
   };

   const handlePrevious = () => {
      let newIndex = currentIndex - 1;
      let newSong: Song;
      if (newIndex >= 0) {
         newSong = songs[newIndex];
      } else {
         newSong = songs[songs.length - 1];
         newIndex = songs.length - 1;
      }

      setCurrentSong({
         song: newSong,
         from: "songs",
         index: newIndex,
      });
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

      updateTimeProgressEle(currentTime);

      // set localStorage
      if (Math.round(currentTime) % 3 === 0)
         setLocalStorage("timeProcess", Math.round(currentTime));
   };

   const handleEnded = () => {
      if (currentIndexRef.current === songs.length - 1) {
         if (songs.length === 1) {
            handleResetForNewSong();

            // setIsPlaying(false);
            // setIsWaiting(false);
            setStatus("paused");

            return;
         } else {
            const isTimer = !!getLocalStorage()["timer"] || 0;
            if (!isTimer) isPlayAllSong.current = true;
         }
      }

      return handleNext();
   };

   const handleError = () => {
      if (firstTimeSongLoaded.current) return;
      if (songs.length > 1) {
         handleNext();
      }
      //  setIsPlaying(false);
      else setStatus("paused");
   };

   const handleLoaded = () => {
      if (!audioEle) {
         setStatus("paused");
         return;
      }

      const storage = getLocalStorage();
      const current = storage["current"];

      if (!firstTimeSongLoaded.current || !current)
         if (currentIndexRef.current !== undefined)
            setLocalStorage("current", {
               from,
               index: currentIndexRef.current,
               song: currentSongRef.current,
            } as CurrentSong);

      // case end of list

      if (isPlayAllSong.current) {
         isPlayAllSong.current = false;

         // setIsPlaying(false);
         // setIsWaiting(false);

         setStatus("paused");
         setLocalStorage("timeProcess", 0);
         return;
      }

      if (firstTimeSongLoaded.current) {
         // setIsPlaying(false);
         // setIsWaiting(false);
         setStatus("paused");

         if (firstTimeSongLoaded.current) {
            /** set when click play button */
            // firstTimeSongLoaded.current = false;

            // if user have play any song before
            // on the other hand the localStore have current song value
            // then update audio current time
            if (current?.song?.id === currentSongRef.current?.id) {
               // update time line ui
               updateTimeProgressEle(storage["timeProcess"] || 0);
               return;
            }

            // the first time user click any song
            // the current song in localStorage is empty
            // then play the song
            play();
         }
      }

      // normal click play case
      play();
   };

   useEffect(() => {
      const storage = getLocalStorage();
      const current = storage["current"] as CurrentSong;

      if (current) {
         if (songs.length && songs.find((s) => s.id === current.song.id))
            setCurrentSong({
               song: current.song,
               index: current.index,
               from: current.from,
            });
      }
   }, []);

   // add events listener
   useEffect(() => {
      if (!audioEle) {
         console.log("Audio element is undefined in use control");
         return;
      }

      audioEle.addEventListener("error", handleError);
      // audioEle.addEventListener("pause", handlePause);
      // audioEle.addEventListener("playing", handlePlaying);
      audioEle.addEventListener("timeupdate", handleTimeUpdate);
      audioEle.addEventListener("ended", handleEnded);
      audioEle.addEventListener("loadedmetadata", handleLoaded);

      return () => {
         audioEle?.removeEventListener("error", handleError);
         // audioEle?.removeEventListener("pause", handlePause);
         // audioEle?.removeEventListener("playing", handlePlaying);
         audioEle?.removeEventListener("timeupdate", handleTimeUpdate);
         audioEle?.removeEventListener("ended", handleEnded);
         audioEle?.removeEventListener("loadedmetadata", handleLoaded);
      };
   }, []);

   useEffect(() => {
      if (!audioEle) return;

      currentSongRef.current = currentSong;

      if (!currentSong) return;

      currentIndexRef.current = currentIndex;

      pause();

      return () => {
         handleResetForNewSong();
      };
   }, [currentSong]);

   const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === " ") {
         e.preventDefault();
         e.stopPropagation();

         console.log("check ", currentIndexRef.current);

         if (currentIndexRef.current !== undefined)
            isPlayingRef.current ? pause() : play();
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
   };
}
