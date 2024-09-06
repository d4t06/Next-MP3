import { nextAuthOptions } from "@/app/api/auth/[...nextauth]/authOption";
import DashboardSongItem from "@/components/DashboardSongItem";
import NoResult from "@/components/NoResult";
import Button from "@/share/_components/Button";
import { getAllSong } from "@/share/services/getAllSong";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export const revalidate = 864000

async function SongList() {
   const data = await getAllSong();
   if (!data || !data.songs.length) return <NoResult />;

   return (
      <>
         <div className="h-[40px] flex items-center space-x-2">
            <div className="text-amber-900">{data.count} songs</div>
         </div>

         <div className="flex-grow overflow-y-auto no-scrollbar">
            {data.songs.map((s, index) => (
               <DashboardSongItem song={s} key={index} />
            ))}
         </div>
      </>
   );
}

export default async function DashboardPage() {
   const session = await getServerSession(nextAuthOptions);

   if (!session) return redirect("/signin");

   return (
      <>
         <div className="container md:max-w-[800px] h-full flex flex-col">
            <div className="flex mt-5 justify-between items-center">
               <div className="text-xl text-amber-900 font-semibold">Songs</div>

               <Button className="" size={"clear"} colors={"second"}>
                  <label
                     className="flex space-x-1 px-3 py-1"
                     htmlFor="song-upload"
                  >
                     <ArrowUpTrayIcon className="w-6" />
                     <span className="hidden sm:block">Upload</span>
                  </label>
               </Button>
            </div>

            <Suspense fallback="...loading">
               <SongList />
            </Suspense>
         </div>
      </>
   );
}
