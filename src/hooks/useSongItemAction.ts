import { runRevalidateTag } from "@/app/actions";
import { sleep } from "@/share/utils/appHelper";
import { useToast } from "@/stores/toastContext";
import { useSession } from "next-auth/react";
import { useState } from "react";

const SONG_URL = `${
   process.env.NEXT_PUBLIC_API_ENDPOINT || "https://nest-mp3.vercel.app/api"
}/songs`;

export default function useSongItemAction() {
   const [isFetching, setIsFetching] = useState(false);

   const { data: session } = useSession();
   const { setErrorToast, setSuccessToast } = useToast();

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
               const res = await fetch(`${SONG_URL}/${props.song.id}`, {
                  method: "Delete",
                  headers,
               });

               if (!res.ok) throw new Error("");

               setSuccessToast(`'${props.song.name}' deleted`);

               break;

            case "edit":
               headers.set("Content-Type", "application/json");
               const ress = await fetch(`${SONG_URL}/${props.id}`, {
                  method: "Put",
                  headers,
                  body: JSON.stringify(props.song),
               });

               if (!ress.ok) throw new Error("");

               setSuccessToast(`Edit song successful`);
               break;
         }

         await runRevalidateTag("songs");
      } catch (error) {
         console.log(error);
         setErrorToast();
      } finally {
         setIsFetching(false);
      }
   };

   return { action, isFetching };
}
