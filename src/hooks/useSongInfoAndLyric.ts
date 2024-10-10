import { API_ENDPOINT, sleep } from "@/share/utils/appHelper";
import { RefObject, useEffect, useRef, useState } from "react";

type Props = {
   currentSong: Song;
   audioRef: RefObject<HTMLAudioElement>;
};

export default function useSongInfoAndLyric({ audioRef, currentSong }: Props) {
   const [tab, setTab] = useState<"info" | "lyrics">("info");
   const [lyrics, setLyrics] = useState<Lyric[]>();
   const [isFetching, setIsFetching] = useState(false);

   const [currentTime, setCurrentTime] = useState(0);

   const scrollBehavior = useRef<ScrollBehavior>("instant");

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
      setCurrentTime(audioRef.current?.currentTime || 0);
   };

   useEffect(() => {
      return () => {
         setLyrics(undefined);
      };
   }, [currentSong]);

   useEffect(() => {
      if (tab === "lyrics") {
         const activeLyric = document.querySelector(".active.lyric");
         if (activeLyric) {
            activeLyric.scrollIntoView({
               behavior: "instant",
               block: "center",
            });
         }

         if (!lyrics) getLyrics();
      }
   }, [tab]);

   useEffect(() => {
      if (!audioRef.current) return;

      audioRef.current.addEventListener("timeupdate", handleTimeUpdate);

      return () => {
         audioRef.current?.removeEventListener("timeupdate", handleTimeUpdate);
      };
   }, []);

   return { tab, setTab, lyrics, scrollBehavior, currentTime, isFetching };
}
