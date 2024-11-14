import { usePlayerContext } from "@/stores/PlayerContext";
import { ElementRef, use, useEffect, useRef, useState } from "react";

type Props = {
   lyrics: Lyric[];
};

const LYRIC_TIME_BOUNDED = 0.3;

export default function useSongLyric({ lyrics }: Props) {
   const { currentIndex, tab, audioEleRef } = usePlayerContext();

   const [currentLyricIndex, setCurrentLyricIndex] = useState(0);

   const scrollBehavior = useRef<ScrollBehavior>("instant"); // skip animation when long seek
   const currentTimeRef = useRef(0);
   const lyricRefs = useRef<ElementRef<"p">[]>([]);
   const currentLyricIndexRef = useRef(0);

   const handleTimeUpdate = () => {
      if (!audioEleRef.current) return;

      const direction =
         audioEleRef.current.currentTime > currentTimeRef.current
            ? "forward"
            : "backward";

      currentTimeRef.current = audioEleRef.current.currentTime;

      let nextIndex = currentLyricIndexRef.current;

      switch (direction) {
         case "forward":
            while (
               lyrics[nextIndex + 1] &&
               lyrics[nextIndex + 1].start - LYRIC_TIME_BOUNDED <
                  currentTimeRef.current + LYRIC_TIME_BOUNDED
            ) {
               nextIndex += 1;
            }
            break;

         case "backward":
            while (
               lyrics[nextIndex - 1] &&
               lyrics[nextIndex - 1].end - LYRIC_TIME_BOUNDED >
                  currentTimeRef.current + LYRIC_TIME_BOUNDED
            ) {
               nextIndex -= 1;
            }
            break;
      }

      if (nextIndex !== currentLyricIndexRef.current) {
         // make scroll instantly
         if (Math.abs(nextIndex - currentLyricIndexRef.current) > 5)
            scrollBehavior.current = "instant";

         setCurrentLyricIndex(nextIndex);

         if (lyricRefs.current[nextIndex]) {
            lyricRefs.current[nextIndex].scrollIntoView({
               behavior: scrollBehavior.current,
               block: "center",
            });

            if (scrollBehavior.current === "instant")
               scrollBehavior.current = "smooth";
         }
      }
   };

   const resetForNewSong = () => {
      setCurrentLyricIndex(0);
   };

   // Add event to get current time
   useEffect(() => {
      if (!audioEleRef.current || tab !== "lyric" || !lyrics.length) return;

      audioEleRef.current?.addEventListener("timeupdate", handleTimeUpdate);

      return () => {
         audioEleRef.current?.removeEventListener(
            "timeupdate",
            handleTimeUpdate
         );
      };
   }, [tab, lyrics]);

   // reset
   useEffect(() => {
      return resetForNewSong;
   }, [currentIndex]);


   // update ref
   useEffect(() => {
      currentLyricIndexRef.current = currentLyricIndex;
   }, [currentLyricIndex]);

   return {
      currentLyricIndex,
      lyricRefs,
   };
}
