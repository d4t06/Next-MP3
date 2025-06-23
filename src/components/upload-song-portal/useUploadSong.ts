import { runRevalidateTag } from "@/app/actions";
import useInterceptRequest from "@/hooks/useInterceptRequest";
import {
   API_ENDPOINT,
   convertToEn,
   initSongObject,
} from "@/share/utils/appHelper";
import parseSongFromFile from "@/share/utils/parseSong";
import { useToast } from "@/stores/toastContext";
import { upload } from "@imagekit/react";
import { ChangeEvent, useState } from "react";

type Props = {
   toggleModal: () => void;
};

type ImageKitAuthKeys = {
   signature: string;
   expire: number;
   token: string;
   publicKey: string;
};

export default function useUploadImage({ toggleModal }: Props) {
   // hooks
   const { setErrorToast, setSuccessToast } = useToast();

   const [songSchemas, setSongSchemas] = useState<SongSchema[]>([]);
   const [currentIndex, setCurrentIndex] = useState(0);
   const [isUploading, setIsUploading] = useState(false);

   const $fetch = useInterceptRequest();

   const handleInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
      try {
         const inputEle = e.target as HTMLInputElement & { files: FileList };
         const fileLists = inputEle.files;

         if (!fileLists.length) return;

         setIsUploading(true);
         toggleModal();

         const processSongList: SongSchema[] = [];

         const start = Date.now();

         for (const file of fileLists) {
            const { duration, name, singer } = await parseSongFromFile(file);
            const songSchema: SongSchema = initSongObject({
               duration: Math.floor(duration),
               name,
               singer,
               size: Math.ceil(file.size / 1024),
            });

            processSongList.push(songSchema);
         }

         setSongSchemas(processSongList);

         for (let i = 0; i < fileLists.length; i++) {
            setCurrentIndex(i);

            const file = fileLists[i];

            const getAuthKeyRes =
               await $fetch.get<ImageKitAuthKeys>("/storage/auth");
            const { expire, publicKey, signature, token } = getAuthKeyRes.data;

            const { url, fileId } = await upload({
               expire,
               token,
               signature,
               publicKey,
               file,
               fileName: convertToEn(file.name),
            });

            Object.assign(processSongList[i], {
               song_url: url,
               song_file_path: fileId,
            } as Partial<SongSchema>);

            await $fetch.post(`${API_ENDPOINT}/songs`, processSongList[i]);
         }

         await runRevalidateTag("songs");

         setSuccessToast(
            `Upload song successful after ${(Date.now() - start) / 1000}s`,
         );
      } catch (error) {
         console.log(error);
         setErrorToast("Upload song failed");
      } finally {
         e.target.value = "";

         setIsUploading(false);
         toggleModal();
         setSongSchemas([]);
      }
   };

   return { handleInputChange, songSchemas, currentIndex, isUploading };
}
