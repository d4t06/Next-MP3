import { LyricEditorControlRef } from "@/components/LyricEditorControl";
import { useEditLyricContext } from "@/stores/editLyricContext";
import { useToast } from "@/stores/toastContext";
import { useSession } from "next-auth/react";
import { ElementRef, RefObject, useEffect, useRef, useState } from "react";

type Props = {
   songWithLyric: SongWithLyric;
   controlRef: RefObject<LyricEditorControlRef>;
};

const API_ENDPOINT = `${
   process.env.NEXT_PUBLIC_API_ENDPOINT || "https://nest-mp3.vercel.app/api"
}`;

export default function useLyricEditor({ songWithLyric, controlRef }: Props) {
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
         controlRef.current?.pause();
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
            const latestEndTime = parsedLyric[latestIndex].end;

            audioRef.current.currentTime = latestEndTime;
            start.current = latestEndTime;
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
