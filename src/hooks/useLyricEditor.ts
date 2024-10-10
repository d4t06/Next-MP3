import { useEditLyricContext } from "@/stores/editLyricContext";
import { useToast } from "@/stores/toastContext";
import { useSession } from "next-auth/react";
import { ElementRef, useEffect, useRef, useState } from "react";

type Props = {
   songWithLyric: SongWithLyric;
};

const API_ENDPOINT = `${
   process.env.NEXT_PUBLIC_API_ENDPOINT || "https://nest-mp3.vercel.app/api"
}`;

export default function useLyricEditor({ songWithLyric }: Props) {
   const { data: session } = useSession();

   const [_hasAudioEle, setHasAudioEle] = useState(false);
   const audioRef = useRef<ElementRef<"audio">>(null);

   const {
      baseLyric,
      setBaseLyricArr,
      setBaseLyric,
      setLyrics,
      setCurrentLyricIndex,
      lyrics,
      setIsFetching,
      isFetching,
      isChanged,
      setIsChanged,
      start,
   } = useEditLyricContext();
   const { setErrorToast, setSuccessToast } = useToast();

   const handleAddLyric = async () => {
      try {
         setIsFetching(true);

         const header = new Headers();
         header.set("Authorization", `Bearer ${session?.token}`);
         header.set("Content-Type", "application/json");

         const newSongLyric: SongLyric = {
            base_lyric: baseLyric,
            lyrics: JSON.stringify(lyrics),
            song_id: songWithLyric.id,
            id: songWithLyric.song_lyric?.id,
         };

         await fetch(`${API_ENDPOINT}/song-lyrics`, {
            method: "POST",
            headers: header,
            body: JSON.stringify(newSongLyric),
         });

         setSuccessToast("Update song lyric successful");
         setIsChanged(false);
      } catch (error) {
         setErrorToast("");
      } finally {
         setIsFetching(false);
      }
   };

   // init
   useEffect(() => {
      if (audioRef.current) setHasAudioEle(true);

      if (songWithLyric.song_lyric) {
         setBaseLyric(songWithLyric.song_lyric.base_lyric);

         const parsedLyric = JSON.parse(
            songWithLyric.song_lyric.lyrics
         ) as Lyric[];

         setLyrics(parsedLyric);

         const latestIndex = parsedLyric.length - 1;

         setCurrentLyricIndex(latestIndex + 1);

         if (audioRef.current) {
            const latestCurrentTime = parsedLyric[latestIndex].start;

            audioRef.current.currentTime = latestCurrentTime;
            start.current = latestCurrentTime;
         }
      }
   }, []);

   // update base lyric array
   useEffect(() => {
      if (!baseLyric) return;

      const filteredLyric = baseLyric.split(/\r?\n/).filter((l) => l);
      setBaseLyricArr(filteredLyric);
   }, [baseLyric]);

   return { audioRef, isFetching, isChanged, handleAddLyric };
}
