import { API_ENDPOINT, sleep } from "@/share/utils/appHelper";
import { usePlayerContext } from "@/stores/PlayerContext";
import { ElementRef, useEffect, useRef, useState } from "react";

type Props = {
   audioEle: HTMLAudioElement;
};

const LYRIC_TIME_BOUNDED = 0.3;

export default function useSongInfoAndLyric({ audioEle }: Props) {
   const { currentSongRef, currentIndex } = usePlayerContext();

   const [tab, setTab] = useState<"info" | "lyrics">("info");
   const [currentLyricIndex, setCurrentLyricIndex] = useState(0);
   const [lyrics, setLyrics] = useState<Lyric[]>([]);
   const [isFetching, setIsFetching] = useState(true);
   const [isSongLoaded, setIsSongLoaded] = useState(false);

   const ranGetLyrics = useRef(false); // make get lyric request one
   const scrollBehavior = useRef<ScrollBehavior>("instant"); // skip animation when long seek
   const timeOutId = useRef<NodeJS.Timeout>(); // debounced request

   const currentTimeRef = useRef(0);
   const lyricRefs = useRef<ElementRef<"p">[]>([]);
   const currentLyricIndexRef = useRef(0);

   const getLyrics = async () => {
      try {
         if (!currentSongRef.current) return;

         setIsFetching(true);

         const res = await fetch(
            `${API_ENDPOINT}/song-lyrics?song_id=${currentSongRef.current.id}`
         );

         const payload = (await res.json()) as { data: SongLyric };

         if (payload.data) {
            const lyrics = JSON.parse(payload.data.lyrics) as Lyric[];
            setLyrics(lyrics);
         }
      } catch (error) {
         console.log(error);
      } finally {
         setIsFetching(false);
      }
   };

   const handleTimeUpdate = () => {
      const direction =
         audioEle.currentTime > currentTimeRef.current ? "forward" : "backward";

      currentTimeRef.current = audioEle.currentTime;

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

         currentLyricIndexRef.current = nextIndex;
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

   const handleSongLoaded = () => {
      setIsSongLoaded(true);
   };

   const resetForNewSong = () => {
      clearTimeout(timeOutId.current);
      setIsFetching(true);
      setIsSongLoaded(false);
      setLyrics([]);
      currentLyricIndexRef.current = 0;
      setCurrentLyricIndex(0);
      ranGetLyrics.current = false;
   };

   //  Add loaded event to make a get lyric request after song loaded
   useEffect(() => {
      audioEle?.addEventListener("loadeddata", handleSongLoaded);

      return () => {
         audioEle?.removeEventListener("loadeddata", handleSongLoaded);
      };
   }, []);

   // Add event to get current time
   useEffect(() => {
      if (!audioEle || tab !== "lyrics" || !lyrics.length) return;

      audioEle.addEventListener("timeupdate", handleTimeUpdate);

      return () => {
         audioEle.removeEventListener("timeupdate", handleTimeUpdate);
      };
   }, [tab, lyrics]);

   // get lyric
   useEffect(() => {
      if (tab === "lyrics") {
         // scroll active song to center when switch tab
         const activeLyric = document.querySelector(".active-lyric");
         if (activeLyric) {
            activeLyric.scrollIntoView({
               behavior: "instant",
               block: "center",
            });
         }

         if (!lyrics.length && !ranGetLyrics.current) {
            ranGetLyrics.current = true;

            timeOutId.current = setTimeout(getLyrics, 500);
         }
      }
   }, [tab, isSongLoaded]);

   // reset
   useEffect(() => {
      return resetForNewSong;
   }, [currentIndex]);

   return {
      tab,
      setTab,
      lyrics,
      scrollBehavior,
      currentLyricIndex,
      isFetching,
      currentSongRef,
      lyricRefs,
   };
}
