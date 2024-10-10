import { nextAuthOptions } from "@/app/api/auth/[...nextauth]/authOption";
import DashboardSongItem from "@/components/DashboardSongItem";
import NoResult from "@/components/NoResult";
import Button from "@/share/_components/Button";
import { Center } from "@/share/_components/Center";
import { getAllSong } from "@/share/services/songService";
import {
   ArrowPathIcon,
   ArrowUpTrayIcon,
   HomeIcon,
} from "@heroicons/react/24/outline";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export const revalidate = 864000;

async function SongList() {
   const data = await getAllSong();
   if (!data || !data.songs.length) return <NoResult />;

   return (
      <>
         <div className="h-[40px] pb-2 flex items-center space-x-2 border-b border-amber-800/15">
            <div className="text-amber-900">{data.count} songs</div>
         </div>

         <div className="flex-grow overflow-y-auto no-scrollbar pb-[80px]">
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
         <div className="h-full flex flex-col">
            <div className="flex mt-5 justify-between items-center ">
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

            <Suspense
               fallback={
                  <Center>
                     <ArrowPathIcon className="text-amber-800 w-6 animate-spin" />
                  </Center>
               }
            >
               <SongList />
            </Suspense>

            <Button
               href="/"
               className="!absolute p-2 bottom-5 left-8"
               size={"clear"}
            >
               <HomeIcon className="w-6" />
            </Button>
         </div>
      </>
   );
}
