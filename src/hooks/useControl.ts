import {
   formatTime,
   getLocalStorage,
   setLocalStorage,
} from "@/share/utils/appHelper";
import { useCurrentSong } from "@/stores/currentSongContext";
import { useQueue } from "@/stores/songQueueContext";
import { log } from "console";
import {
   MouseEventHandler,
   RefObject,
   useEffect,
   useRef,
   useState,
} from "react";
import useVolume from "./useVolume";

type Props = {
   audioRef: RefObject<HTMLAudioElement>;
   processLineRef: RefObject<HTMLDivElement>;
   currentTimeRef: RefObject<HTMLDivElement>;
};

export default function useControl({
   audioRef,
   currentTimeRef,
   processLineRef,
}: Props) {
   const { songs, setQueue } = useQueue();
   const { currentIndex, setCurrentSong, currentSong, from } = useCurrentSong();

   const [isPlaying, setIsPlaying] = useState(false);
   const [isWaiting, setIsWaiting] = useState(false);
   const [isError, setIsError] = useState(false);

   const firstTimeSongLoaded = useRef(true);
   const isPlayAllSong = useRef(false);
   const currentIndexRef = useRef(0);
   const currentSongRef = useRef<Song | null>(null);
   // const processLineRefWidth = useRef<number>();

   const play = () => {
      try {
         audioRef.current?.play();
      } catch (error) {}
   };

   const pause = () => {
      audioRef.current?.pause();
   };

   // const getNewSong = (index: number) => {
   //    return songs[index];
   // };

   const handlePause = () => {
      setIsPlaying(false);
      // dispatch(setPlayStatus({ isPlaying: false }));

      // if (intervalId.current) clearInterval(intervalId.current);
   };

   const handlePlayPause = () => {
      isPlaying ? pause() : play();
   };

   const handlePlaying = () => {
      firstTimeSongLoaded.current = false;
      setIsPlaying(true);
      setIsWaiting(false);

      // dispatch(
      //    setPlayStatus({ isPlaying: true, isWaiting: false, isError: false })
      // );
   };

   const handleResetForNewSong = () => {
      // setIsLoaded(false);
      setIsWaiting(true);

      // if (!firstTimeSongLoaded.current) setLocalStorage("duration", 0);

      if (
         processLineRef.current &&
         currentTimeRef.current
         // remainingTimeRef.current
      ) {
         currentTimeRef.current.innerText = "0:00";
         // remainingTimeRef.current.innerText = "00:00";
         processLineRef.current.style.background = "white";
      }
   };

   const handleSeek = <MouseEventHandler>function (e) {
      if (!audioRef.current) return;
      const node = e.target as HTMLElement;

      if (processLineRef.current) {
         const clientRect = node.getBoundingClientRect();

         const length = e.clientX - clientRect.left;
         const lengthRatio = length / processLineRef.current.clientWidth;
         const newSeekTime = lengthRatio * audioRef.current.duration;

         // if (audioRef.current) {
         // const currentTime = audioRef.current.currentTime;

         // if (prevSeekTime.current) {
         //    if (
         //       Math.abs(currentTime - prevSeekTime.current) < 1 &&
         //       Math.abs(newSeekTime - prevSeekTime.current) < 1
         //    ) {
         //       console.log("no seek");
         //       return;
         //    }
         // }

         audioRef.current.currentTime = newSeekTime;
         // prevSeekTime.current = newSeekTime;
         // }
      }
   };

   const handleNext = () => {
      let newIndex = currentIndexRef.current + 1;
      let newSong: Song;

      if (newIndex < songs.length) {
         newSong = songs[newIndex];
      } else {
         newIndex = 0;
         newSong = songs[0];
      }

      console.log("check new index", newIndex, newSong, songs);

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

   const handleTimeUpdate = () => {
      if (!audioRef.current) {
         console.log("auto ele is undefined when update time");
         return;
      }

      const currentTime = audioRef.current?.currentTime;
      const timeLine = processLineRef.current;

      if (audioRef.current.duration && currentTime && timeLine) {
         const ratio = currentTime / (audioRef.current.duration / 100);
         timeLine.style.background = `linear-gradient(to right, #fbbf24 ${ratio}%, white ${ratio}%, white 100%)`;
      }

      if (currentTimeRef.current) {
         currentTimeRef.current.innerText = formatTime(currentTime!) || "00:00";
      }
   };

   const handleEnded = () => {
      if (currentIndex === songs.length - 1) {
         isPlayAllSong.current = true;
      }

      return handleNext();
   };

   const handleError = () => {
      if (firstTimeSongLoaded.current) return;
      if (songs.length > 1) {
         handleNext();
      } else setIsPlaying(false);
   };

   const handleLoaded = () => {
      if (!audioRef.current) {
         setIsWaiting(false);
         return;
      }

      const storage = getLocalStorage();
      const current = storage["current"];

      if (!firstTimeSongLoaded.current || !current)
         setLocalStorage("current", {
            from,
            index: currentIndexRef.current,
            song: currentSongRef.current,
         } as CurrentSong);

      // case end of list
      if (isPlayAllSong.current) {
         isPlayAllSong.current = false;
         setIsPlaying(false);
         setIsWaiting(false);
         return;
      }

      if (firstTimeSongLoaded.current) {
         setIsPlaying(false);
         setIsWaiting(false);

         if (firstTimeSongLoaded.current) {
            firstTimeSongLoaded.current = false;

            // if user have play any song before
            // on the other hand the localStore have current song value
            // then update audio current time
            if (current?.song?.id === currentSongRef.current?.id) {
               audioRef.current.currentTime = storage["duration"] || 0;
               // update time line ui
               handleTimeUpdate();
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

      const queueSongs: Song[] = storage["queue"] || [];

      if (queueSongs.length) {
         if (current)
            setCurrentSong({
               song: current.song,
               index: current.index,
               from: current.from,
            });

         setQueue(queueSongs);
      }
   }, []);

   // add events listener
   useEffect(() => {
      if (!audioRef.current) {
         console.log("Audio element is undefined in use control");
         return;
      }

      audioRef.current.addEventListener("error", handleError);
      audioRef.current.addEventListener("pause", handlePause);
      audioRef.current.addEventListener("playing", handlePlaying);
      audioRef.current.addEventListener("timeupdate", handleTimeUpdate);

      return () => {
         audioRef.current?.removeEventListener("error", handleError);
         audioRef.current?.removeEventListener("pause", handlePause);
         audioRef.current?.removeEventListener("playing", handlePlaying);
         audioRef.current?.removeEventListener("timeupdate", handleTimeUpdate);
      };
   }, []);

   useEffect(() => {
      if (!audioRef.current) {
         console.log("Audio element is undefined in use control");
         return;
      }

      audioRef.current.addEventListener("ended", handleEnded);
      audioRef.current.addEventListener("loadedmetadata", handleLoaded);

      return () => {
         audioRef.current?.removeEventListener("ended", handleEnded);
         audioRef.current?.removeEventListener("loadedmetadata", handleLoaded);
      };
   }, [songs]);

   useEffect(() => {
      if (!audioRef.current) return;

      currentSongRef.current = currentSong;

      if (!currentSong) return;

      currentIndexRef.current = currentIndex;

      pause();

      return () => {
         handleResetForNewSong();
      };
   }, [currentSong]);

   return {
      handleNext,
      handleSeek,
      handlePrevious,
      handlePlayPause,
      isPlaying,
      isWaiting,
   };
}
