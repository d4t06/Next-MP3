import { API_ENDPOINT } from "@/share/utils/appHelper";
import { usePlayerContext } from "@/stores/PlayerContext";
import { useEffect, useRef, useState } from "react";

export default function useGetLyic() {
   const { currentSongRef, tab, currentIndex, audioEleRef } =
      usePlayerContext();

   const [lyrics, setLyrics] = useState<Lyric[]>([]);
   const [isFetching, setIsFetching] = useState(true);
   const [isSongLoaded, setIsSongLoaded] = useState(false);

   const ranGetLyrics = useRef(false); // make get lyric request one
   const timeOutId = useRef<NodeJS.Timeout>(); // debounced request

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

   const handleSongLoaded = () => {
      setIsSongLoaded(true);
   };

   const resetForNewSong = () => {
      clearTimeout(timeOutId.current);
      setIsFetching(true);
      setIsSongLoaded(false);
      setLyrics([]);
      ranGetLyrics.current = false;
   };

   //  Add loaded event to make a get lyric request after song loaded
   useEffect(() => {
      audioEleRef.current?.addEventListener("loadeddata", handleSongLoaded);

      return () => {
         audioEleRef.current?.removeEventListener("loadeddata", handleSongLoaded);
      };
   }, []);

   // get lyric
   useEffect(() => {
      if (tab === "lyric") {
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

   return { isFetching, lyrics };
}
