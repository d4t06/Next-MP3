import { nextAuthOptions } from "@/app/api/auth/[...nextauth]/authOption";
import CheckAuth from "@/components/CheckAuth";
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
         <div className="container md:max-w-[800px] h-[40px] pb-2 flex items-center space-x-2 border-b border-amber-800/15">
            <div className="text-amber-900">{data.count} songs</div>
         </div>

         <div className="flex-grow overflow-y-auto no-scrollbar ">
            <div className="container md:max-w-[800px] pb-[80px]">
               {data.songs.map((s, index) => (
                  <DashboardSongItem song={s} key={index} />
               ))}
            </div>
         </div>
      </>
   );
}

export default async function DashboardPage() {
   // server session only change when refresh page or navigate
   const session = await getServerSession(nextAuthOptions);

   console.log("dashboard check session", new Date().toTimeString(), session);
   if (!session) return redirect("/signin");


   /** this code doesn't work
    * after login, navigate back to /dashboard
    * but session doesn't update yet
    * then sign out and back to sign in page again
    */
   // check auth on server side
   // if (session.error) return <CheckAuth session={session} />;

   return (
      <>
         {/* Check auth on client side
         session context update when call session callback called (call update()), except navigate */}
         <CheckAuth />
         <div className="h-full flex flex-col">
            <div className="flex mt-5 justify-between items-center container md:max-w-[800px]">
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
