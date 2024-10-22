import { API_ENDPOINT, sleep } from "@/share/utils/appHelper";
import { useEffect, useRef, useState } from "react";

type Props = {
   currentSong: Song;
   audioEle: HTMLAudioElement;
};

export default function useSongInfoAndLyric({ audioEle, currentSong }: Props) {
   const [tab, setTab] = useState<"info" | "lyrics">("info");
   const [lyrics, setLyrics] = useState<Lyric[]>();
   const [isFetching, setIsFetching] = useState(true);
   const [currentTime, setCurrentTime] = useState(0);
   const [isSongLoaded, setIsSongLoaded] = useState(false);

   const ranGetLyrics = useRef(false); // make get lyric request one
   const scrollBehavior = useRef<ScrollBehavior>("instant"); // skip animation when long seek
   const timeOutId = useRef<NodeJS.Timeout>(); // debounced request

   const getLyrics = async () => {
      try {
         setIsFetching(true);

         await sleep(500);

         const res = await fetch(
            `${API_ENDPOINT}/song-lyrics?song_id=${currentSong.id}`
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
      if (!audioEle) return;

      const currentTime = audioEle.currentTime;
      setCurrentTime(currentTime);
   };

   const handleSeeked = () => {
      if (!audioEle) return;
      const _currentTime = audioEle.currentTime;

      // disable animation
      if (Math.abs(_currentTime - currentTime) > 20) {
         scrollBehavior.current = "instant";
         return;
      }
   };

   const resetForNewSong = () => {
      clearTimeout(timeOutId.current);
      setIsFetching(true);
      setIsSongLoaded(false);
      setLyrics(undefined);
      ranGetLyrics.current = false;
   };

   // Add event to get current time
   useEffect(() => {
      if (!audioEle) return;

      audioEle.addEventListener("timeupdate", handleTimeUpdate);
      audioEle.addEventListener("seeked", handleSeeked);

      return () => {
         audioEle?.removeEventListener("timeupdate", handleTimeUpdate);
         audioEle?.removeEventListener("seeked", handleSeeked);
      };
   }, []);

   //  Add loaded event to make a get lyric request after song loaded
   useEffect(() => {
      const handleSongLoaded = async () => {
         console.log("song loaded");
         setIsSongLoaded(true);
      };

      audioEle?.addEventListener("loadeddata", handleSongLoaded);

      return () => {
         audioEle?.removeEventListener("loadeddata", handleSongLoaded);
      };
   }, []);

   // reset
   useEffect(() => {
      return () => {
         resetForNewSong();
      };
   }, [currentSong]);

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

         if (!lyrics && !ranGetLyrics.current) {
            ranGetLyrics.current = true;
            timeOutId.current = setTimeout(getLyrics, 500);
         }
      }
   }, [tab, isSongLoaded]);

   return { tab, setTab, lyrics, scrollBehavior, currentTime, isFetching };
}
