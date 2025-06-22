import { nextAuthOptions } from "@/app/api/auth/[...nextauth]/authOption";
import LyricEditor from "./_components/LyricEditor";
import * as songService from "@/share/services/songService";
import EditLyricContextProvider from "./_components/EditLyricContext";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

type Props = {
   params: { song_id: string };
};

export default async function EditSongLyric(props: Props) {
   const session = await getServerSession(nextAuthOptions);
   if (!session) return redirect("/signin");

   const songWithLyric = await songService.getOneSong(props.params.song_id);
   if (!songWithLyric) return <p>Something went wrong</p>;

   return (
      <EditLyricContextProvider>
         {/* <CheckAuth /> */}
         <div className="container h-full max-w-[800px]">
            <LyricEditor songWithLyric={songWithLyric} />
         </div>
      </EditLyricContextProvider>
   );
}
