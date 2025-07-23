import useInterceptRequest from "@/hooks/useInterceptRequest";
import { API_ENDPOINT, convertToEn } from "@/share/utils/appHelper";
import { useToastContext } from "@/stores/toastContext";
import { upload } from "@imagekit/react";
import { useState } from "react";
import { useEditLyricContext } from "../_components/EditLyricContext";
import { runRevalidateTag } from "@/app/actions";

const SONG_URL = `${API_ENDPOINT}/songs`;

type Props = {
   closeModal: () => void;
};

export default function useChangeSongFile({ closeModal }: Props) {
   const { setErrorToast, setSuccessToast } = useToastContext();
   const { song } = useEditLyricContext();

   const [songFile, setSongFile] = useState<File>();
   const [isFetching, setIsFetching] = useState(false);

   const $fetch = useInterceptRequest();

   const deleteSongFile = async (id: string) => {
      try {
         await $fetch.delete(`/storage/${id}`);
      } catch (error) {
         console.log(error);
      }
   };

   const submit = async () => {
      try {
         if (!songFile || !song) return;

         setIsFetching(true);

         const getAuthKeyRes =
            await $fetch.get<ImageKitAuthKeys>("/storage/auth");
         const { expire, publicKey, signature, token } = getAuthKeyRes.data;

         deleteSongFile(song.song_file_path);

         const { url, fileId } = await upload({
            expire,
            token,
            signature,
            publicKey,
            file: songFile,
            folder: "next-mp3",
            fileName: convertToEn(songFile.name),
         });

         const newSongData = {
            song_url: url,
            song_file_path: fileId,
         } as Partial<SongSchema>;

         await $fetch.put(`${SONG_URL}/${song.id}`, newSongData);

         await runRevalidateTag(`song-${song.id}`);

         setSuccessToast(`Change song file successful`);

         closeModal();
      } catch (error) {
         console.log(error);
         setErrorToast();
      } finally {
         setIsFetching(false);
      }
   };

   return { songFile, isFetching, submit, setSongFile };
}
