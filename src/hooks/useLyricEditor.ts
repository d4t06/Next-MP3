import { LyricEditorControlRef } from "@/components/LyricEditorControl";
import { API_ENDPOINT, setLocalStorage } from "@/share/utils/appHelper";
import { useEditLyricContext } from "@/stores/editLyricContext";
import { useToast } from "@/stores/toastContext";
import { ElementRef, RefObject, useEffect, useRef, useState } from "react";
import useInterceptRequest from "./useInterceptRequest";

type Props = {
   songWithLyric: SongWithLyric;
   controlRef: RefObject<LyricEditorControlRef>;
};

export default function useLyricEditor({ songWithLyric, controlRef }: Props) {
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
   const request = useInterceptRequest();

   const handleAddLyric = async () => {
      try {
         setIsFetching(true);
         controlRef.current?.pause();

         const newSongLyric: SongLyric = {
            base_lyric: baseLyric,
            lyrics: JSON.stringify(lyrics),
            song_id: songWithLyric.id,
            id: songLyricId,
         };

         const payload = await request.post(
            `${API_ENDPOINT}/song-lyrics`,
            newSongLyric
         );

         if (payload.data.data) {
            if (!songLyricId) setSongLyricId(payload.data.data.id);

            setSuccessToast("Update song lyric successful");
            setIsChanged(false);
         }
      } catch (error) {
         console.log(error);

         setErrorToast();
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
