import { runRevalidateTag } from "@/app/actions";
import { deleteFile } from "@/share/services/firebaseServices";
import { API_ENDPOINT, sleep } from "@/share/utils/appHelper";
import { useToast } from "@/stores/toastContext";
import { useSession } from "next-auth/react";
import { useState } from "react";
import useInterceptRequest from "./useInterceptRequest";

const SONG_URL = `${API_ENDPOINT}/songs`;

export default function useSongItemAction() {
   const [isFetching, setIsFetching] = useState(false);

   const { data: session } = useSession();
   const { setErrorToast, setSuccessToast } = useToast();
   const request = useInterceptRequest();

   type Delete = {
      variant: "delete";
      song: Song;
   };

   type Edit = {
      variant: "edit";
      id: number;
      song: Partial<SongSchema>;
   };

   const action = async (props: Delete | Edit) => {
      try {
         if (!session) throw new Error("");

         const headers = new Headers();
         headers.set("Authorization", `Bearer ${session?.token}`);

         setIsFetching(true);

         if (process.env.NODE_ENV === "development") await sleep(500);

         switch (props.variant) {
            case "delete":
               await request.delete(`${SONG_URL}/${props.song.id}`);
               await deleteFile({ filePath: props.song.song_file_path });

               setSuccessToast(`'${props.song.name}' deleted`);
               break;

            case "edit":
               await request.put(`${SONG_URL}/${props.id}`, props.song);

               setSuccessToast(`Edit song successful`);
               break;
         }

         await runRevalidateTag("songs");
      } catch (error: any) {
         console.log({ message: error });

         setErrorToast();
      } finally {
         setIsFetching(false);
      }
   };

   return { action, isFetching };
}
