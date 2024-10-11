import { LyricEditorControlRef } from "@/components/LyricEditorControl";
import SongInfoAndLyric from "@/components/SongInfoAndLyric";
import { API_ENDPOINT } from "@/share/utils/appHelper";
import { useEditLyricContext } from "@/stores/editLyricContext";
import { useToast } from "@/stores/toastContext";
import { useSession } from "next-auth/react";
import { ElementRef, RefObject, useEffect, useRef, useState } from "react";

type Props = {
   songWithLyric: SongWithLyric;
   controlRef: RefObject<LyricEditorControlRef>;
};

export default function useLyricEditor({ songWithLyric, controlRef }: Props) {
   const { data: session } = useSession();

   const [_hasAudioEle, setHasAudioEle] = useState(false);
   const audioRef = useRef<ElementRef<"audio">>(null);

   const {
      baseLyric,
      songLyricId,
      setBaseLyricArr,
      setBaseLyric,
      setLyrics,
      setCurrentLyricIndex,
      setSongLyricId,
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
         controlRef.current?.pause();

         const header = new Headers();
         header.set("Authorization", `Bearer ${session?.token}`);
         header.set("Content-Type", "application/json");

         const newSongLyric: SongLyric = {
            base_lyric: baseLyric,
            lyrics: JSON.stringify(lyrics),
            song_id: songWithLyric.id,
            id: songLyricId,
         };

         const res = await fetch(`${API_ENDPOINT}/song-lyrics`, {
            method: "POST",
            headers: header,
            body: JSON.stringify(newSongLyric),
         });

         if (!songLyricId)
            if (res.ok) {
               const payload = (await res.json()) as { data: SongLyric };
               if (payload.data) {
                  setSongLyricId(payload.data.id);
               }
            }

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
         setSongLyricId(songWithLyric.song_lyric.id);
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
