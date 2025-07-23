import { API_ENDPOINT } from "@/share/utils/appHelper";
import { useToastContext } from "@/stores/toastContext";
import { RefObject, useEffect, useState } from "react";
import { LyricEditorControlRef } from "@/app/(dahboard)/dashboard/edit-lyric/[song_id]/_components/LyricEditorControl";
import useInterceptRequest from "@/hooks/useInterceptRequest";
import { useEditLyricContext } from "../_components/EditLyricContext";

type Props = {
   songWithLyric: SongWithLyric;
   controlRef: RefObject<LyricEditorControlRef>;
};

export default function useLyricEditorEffect({
   songWithLyric,
   controlRef,
}: Props) {
   const {
      audioRef,
      setSong,
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

   const [hasAudioEle, setHasAudioEle] = useState(false);

   const { setErrorToast, setSuccessToast } = useToastContext();
   const $fetch = useInterceptRequest();

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

         const res = await $fetch
            .post(`${API_ENDPOINT}/song-lyrics`, newSongLyric)
            .catch(() => {
               throw newSongLyric;
            });

         if (res.data.data) {
            if (!songLyricId) setSongLyricId(res.data.data.id);

            setSuccessToast("Update song lyric successful");
            setIsChanged(false);
         }
      } catch (error: any) {
         setErrorToast();
      } finally {
         setIsFetching(false);
      }
   };

   useEffect(() => {
      if (!audioRef.current) return;
      if (!hasAudioEle) setHasAudioEle(true);

      if (hasAudioEle) {
         setSong(songWithLyric);
         audioRef.current.src = songWithLyric.song_url;

         if (songWithLyric.song_lyric) {
            setSongLyricId(songWithLyric.song_lyric.id);
            setBaseLyric(songWithLyric.song_lyric.base_lyric);

            const parsedLyric = JSON.parse(
               songWithLyric.song_lyric.lyrics,
            ) as Lyric[];

            setLyrics(parsedLyric);

            const latestIndex = parsedLyric.length - 1;
            setCurrentLyricIndex(latestIndex + 1);

            const latestEndTime = parsedLyric[latestIndex].end;

            audioRef.current.currentTime = latestEndTime;
            start.current = latestEndTime;
         }
      }

      // update base lyric array
   }, [songWithLyric, hasAudioEle]);

   
   useEffect(() => {
      if (!baseLyric) return;

      const filteredLyric = baseLyric.split(/\r?\n/).filter((l) => l);
      setBaseLyricArr(filteredLyric);
   }, [baseLyric]);

   // handle window reload
   useEffect(() => {
      const handleWindowReload = (e: Event) => {
         if (isChanged) e.preventDefault();
      };

      window.addEventListener("beforeunload", handleWindowReload);

      return () => {
         window.removeEventListener("beforeunload", handleWindowReload);
      };
   }, [isChanged]);

   return {
      isFetching,
      handleAddLyric,
   };
}
