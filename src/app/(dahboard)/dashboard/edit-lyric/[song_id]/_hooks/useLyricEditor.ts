import {
   API_ENDPOINT,
   getLocalStorage,
   setLocalStorage,
} from "@/share/utils/appHelper";
import { useToast } from "@/stores/toastContext";
import { ElementRef, RefObject, useEffect, useRef, useState } from "react";
import { LyricEditorControlRef } from "@/app/(dahboard)/dashboard/edit-lyric/[song_id]/_components/LyricEditorControl";
import { ModalRef } from "@/share/_components";
import useInterceptRequest from "@/hooks/useInterceptRequest";
import { useEditLyricContext } from "../_components/EditLyricContext";

type Props = {
   songWithLyric: SongWithLyric;
   controlRef: RefObject<LyricEditorControlRef>;
   modalRef: RefObject<ModalRef>;
};

export default function useLyricEditor({
   songWithLyric,
   controlRef,
   modalRef,
}: Props) {
   const [_songWithLyric, _setSongWithLyric] = useState(songWithLyric);
   const [_hasAudioEle, setHasAudioEle] = useState(false);

   // const [tempLyric, setTempLyric] = useState<SongLyric | null>(null);
   const tempLyric = useRef<SongLyric | null>(null);
   const audioRef = useRef<ElementRef<"audio">>(null);

   const {
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
   const { setErrorToast, setSuccessToast } = useToast();
   const $fetch = useInterceptRequest();

   const handleAddLyric = async () => {
      try {
         setIsFetching(true);
         controlRef.current?.pause();

         const newSongLyric: SongLyric = {
            base_lyric: baseLyric,
            lyrics: JSON.stringify(lyrics),
            song_id: _songWithLyric.id,
            id: songLyricId,
         };

         const payload = await $fetch
            .post(`${API_ENDPOINT}/song-lyrics`, newSongLyric)
            .catch(() => {
               throw newSongLyric;
            });

         if (payload.data.data) {
            if (!songLyricId) setSongLyricId(payload.data.data.id);

            setSuccessToast("Update song lyric successful");
            setIsChanged(false);

            if (tempLyric.current?.song_id === newSongLyric.song_id)
               setLocalStorage("temp-lyric", "");
         }
      } catch (error: any) {
         setErrorToast();
         setLocalStorage("temp-lyric", error);
      } finally {
         setIsFetching(false);
      }
   };

   const restoreTempLyricInStore = () => {
      _setSongWithLyric((prev) => {
         return { ...prev, song_lyric: tempLyric.current };
      });

      setIsChanged(true);

      modalRef.current?.close();
   };

   // init

   useEffect(() => {
      const songLyricInStorage =
         (getLocalStorage()["temp-lyric"] as SongLyric) || null;
      tempLyric.current = songLyricInStorage;

      if (
         songLyricInStorage &&
         songLyricInStorage.song_id === songWithLyric.id
      ) {
         setTimeout(() => {
            modalRef.current?.open();
         }, 1000);

         return;
      }
   }, []);

   useEffect(() => {
      if (audioRef.current) setHasAudioEle(true);

      if (_songWithLyric.song_lyric) {
         setSongLyricId(_songWithLyric.song_lyric.id);
         setBaseLyric(_songWithLyric.song_lyric.base_lyric);

         const parsedLyric = JSON.parse(
            _songWithLyric.song_lyric.lyrics,
         ) as Lyric[];

         setLyrics(parsedLyric);
         setSong(_songWithLyric);

         const latestIndex = parsedLyric.length - 1;

         setCurrentLyricIndex(latestIndex + 1);

         if (audioRef.current) {
            const latestEndTime = parsedLyric[latestIndex].end;

            audioRef.current.currentTime = latestEndTime;
            start.current = latestEndTime;
         }
      }
   }, [_songWithLyric]);

   // update base lyric array
   useEffect(() => {
      if (!baseLyric) return;

      const filteredLyric = baseLyric.split(/\r?\n/).filter((l) => l);
      setBaseLyricArr(filteredLyric);
   }, [baseLyric]);

   return {
      audioRef,
      isFetching,
      isChanged,
      handleAddLyric,
      restoreTempLyricInStore,
   };
}
