import { runRevalidateTag } from "@/app/actions";
import { API_ENDPOINT, sleep } from "@/share/utils/appHelper";
import { useToastContext } from "@/stores/toastContext";
import { useSession } from "next-auth/react";
import { useState } from "react";
import useInterceptRequest from "./useInterceptRequest";

const SONG_URL = `${API_ENDPOINT}/songs`;

export default function useSongItemAction() {
   const [isFetching, setIsFetching] = useState(false);

   const { data: session } = useSession();
   const { setErrorToast, setSuccessToast } = useToastContext();
   const $fetch = useInterceptRequest();

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

         setIsFetching(true);

         switch (props.variant) {
            case "delete":
               await Promise.all([
                  $fetch.delete(`${SONG_URL}/${props.song.id}`),
                  $fetch.delete(`/storage/${props.song.song_file_path}`),
               ]);

               setSuccessToast(`'${props.song.name}' deleted`);
               break;

            case "edit":
               await $fetch.put(`${SONG_URL}/${props.id}`, props.song);

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
