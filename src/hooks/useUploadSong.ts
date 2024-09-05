import { runRevalidateTag } from "@/app/actions";
import { initSongObject } from "@/share/utils/appHelper";
import parseSongFromFile from "@/share/utils/parseSong";
import { useToast } from "@/stores/toastContext";
import { useSession } from "next-auth/react";
import { ChangeEvent } from "react";

export default function useUploadImage() {
   // hooks
   const { data: session } = useSession();
   const { setErrorToast, setSuccessToast } = useToast();

   const handleInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
      try {
         const inputEle = e.target as HTMLInputElement & { files: FileList };
         const fileLists = inputEle.files;

         const headers = new Headers();
         headers.set("Authorization", `Bearer ${session?.token}`);

         for await (const file of fileLists) {
            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch("http://localhost:4000/api/files", {
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

            const { duration, name, singer } = await parseSongFromFile(file);

            console.log(file.size);

            const songSchema: SongSchema = initSongObject({
               duration: Math.floor(duration),
               name,
               singer,
               size: Math.ceil(file.size / 1024),
               song_url: url,
               song_file_path: filePath,
            });

            //   important, it make validation pipe fail
            headers.set("Content-Type", "application/json");

            await fetch("http://localhost:4000/api/songs", {
               method: "POST",
               headers,
               body: JSON.stringify(songSchema),
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
      }
   };

   return { handleInputChange };
}
