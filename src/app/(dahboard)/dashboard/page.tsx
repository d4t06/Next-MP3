import { nextAuthOptions } from "@/app/api/auth/[...nextauth]/authOption";
import DashboardSongItem from "@/components/DashboardSongItem";
import NoResult from "@/components/NoResult";
import Button from "@/share/_components/Button";
import { getAllSong } from "@/share/services/getAllSong";
import { ArrowUpTrayIcon, TrashIcon } from "@heroicons/react/24/outline";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";

async function SongList() {
   const data = await getAllSong();
   if (!data || !data.songs.length) return <NoResult />;

   return (
      <>
         <div className="h-[40px] flex items-center space-x-2">
            <div className="text-amber-900">{data.count} songs</div>

            {/* <Button
               colors={"second"}
               className="space-x-1 px-1 py-[2px]"
               size={"clear"}
            >
               <TrashIcon className="w-5" />
               <span className="hidden sm:block">Delete</span>
            </Button> */}
         </div>

         <div className="">
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
         <div className="container md:max-w-[800px]">
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
