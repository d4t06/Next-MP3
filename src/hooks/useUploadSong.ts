import { runRevalidateTag } from "@/app/actions";
import { initSongObject } from "@/share/utils/appHelper";
import parseSongFromFile from "@/share/utils/parseSong";
import { useToast } from "@/stores/toastContext";
import { useSession } from "next-auth/react";
import { ChangeEvent, useState } from "react";

const API_ENDPOINT = `${
   process.env.NEXT_PUBLIC_API_ENDPOINT || "https://nest-mp3.vercel.app/api"
}`;

export default function useUploadImage() {
   // hooks
   const { data: session } = useSession();
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

         const headers = new Headers();
         headers.set("Authorization", `Bearer ${session?.token}`);

         const headers2 = new Headers();
         headers2.set("Authorization", `Bearer ${session?.token}`);
         headers2.set("Content-Type", "application/json");

         const schemas: SongSchema[] = [];

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

            const formData = new FormData();
            formData.append("file", fileLists[i]);

            const res = await fetch(`${API_ENDPOINT}/files`, {
               method: "POST",
               headers,
               body: formData,
            });

            if (!res.ok) throw new Error("Upload song file failed");

            const {
               data: { filePath, url },
            } = (await res.json()) as {
               data: {
                  url: string;
                  filePath: string;
               };
            };

            Object.assign(schemas[i], {
               song_url: url,
               song_file_path: filePath,
            } as Partial<SongSchema>);

            await fetch(`${API_ENDPOINT}/songs`, {
               method: "POST",
               headers: headers2,
               body: JSON.stringify(schemas[i]),
            });

            // delete song file if fail when save record to database
            // if (save song fail) {
            // }
         }

         await runRevalidateTag("songs");

         setSuccessToast("Upload song successful");
      } catch (error) {
         console.log(error);
         setErrorToast("Upload song failed");
      } finally {
         setIsUploading(false);
         setSongSchemas([]);
      }
   };

   return { handleInputChange, songSchemas, currentIndex, isUploading };
}
