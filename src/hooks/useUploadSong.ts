import { runRevalidateTag } from "@/app/actions";
import { deleteFile, uploadFile } from "@/share/services/firebaseServices";
import { API_ENDPOINT, initSongObject } from "@/share/utils/appHelper";
import parseSongFromFile from "@/share/utils/parseSong";
import { useToast } from "@/stores/toastContext";
import { useSession } from "next-auth/react";
import { ChangeEvent, useState } from "react";

type Props = {
   toggleModal: () => void;
};

export default function useUploadImage({ toggleModal }: Props) {
   // hooks
   const { data: session, update } = useSession();
   const { setErrorToast, setSuccessToast } = useToast();

   const [songSchemas, setSongSchemas] = useState<SongSchema[]>([]);
   const [currentIndex, setCurrentIndex] = useState(0);
   const [isUploading, setIsUploading] = useState(false);

   const handleInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
      try {
         const inputEle = e.target as HTMLInputElement & { files: FileList };
         const fileLists = inputEle.files;

         if (!fileLists.length) return;

         setIsUploading(true);
         toggleModal();

         const header = new Headers();
         header.set("Authorization", `Bearer ${session?.token}`);
         header.set("Content-Type", "application/json");

         const schemas: SongSchema[] = [];

         const start = Date.now();

         for (const file of fileLists) {
            const { duration, name, singer } = await parseSongFromFile(file);
            const songSchema: SongSchema = initSongObject({
               duration: Math.floor(duration),
               name,
               singer,
               size: Math.ceil(file.size / 1024),
            });

            schemas.push(songSchema);
         }

         setSongSchemas(schemas);

         for (let i = 0; i < fileLists.length; i++) {
            setCurrentIndex(i);

            const { filePath, fileURL } = await uploadFile({
               file: fileLists[i],
            });

            Object.assign(schemas[i], {
               song_url: fileURL,
               song_file_path: filePath,
            } as Partial<SongSchema>);

            const res = await fetch(`${API_ENDPOINT}/songs`, {
               method: "POST",
               headers: header,
               body: JSON.stringify(schemas[i]),
            });

            if (!res.ok) {
               await deleteFile({ filePath });

               if (res.status === 401) await update();
               throw new Error("");
            }
         }

         await runRevalidateTag("songs");

         setSuccessToast(
            `Upload song successful after ${(Date.now() - start) / 1000}s`
         );
      } catch (error) {
         console.log(error);
         setErrorToast("Upload song failed");
      } finally {
         setIsUploading(false);
         toggleModal();
         setSongSchemas([]);
      }
   };

   return { handleInputChange, songSchemas, currentIndex, isUploading };
}
