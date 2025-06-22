import { nextAuthOptions } from "@/app/api/auth/[...nextauth]/authOption";
import SongItem from "./_components/SongItem";
import Button from "@/share/_components/Button";
import { getAllSong } from "@/share/services/songService";
import {
   ArrowPathIcon,
   ArrowUpTrayIcon,
   HomeIcon,
} from "@heroicons/react/24/outline";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import SongListWrapper from "./_components/SongListWrapper";
import { Center, NoResult } from "@/share/_components";

export const revalidate = 864000;

async function SongList() {
   const data = await getAllSong();
   if (!data || !data.songs.length) return <NoResult />;

   return (
      <>
         <SongListWrapper>
            <div className="container md:max-w-[800px] h-[40px] pb-2 flex items-center space-x-2 border-b border-amber-800/15">
               <div className="text-amber-900">{data.count} songs</div>
            </div>

            <div className="flex-grow overflow-y-auto">
               <div className="container md:max-w-[800px] pb-[80px]">
                  {data.songs.map((s, index) => (
                     <SongItem song={s} key={index} />
                  ))}
               </div>
            </div>
         </SongListWrapper>
      </>
   );
}

export default async function DashboardPage() {
   // server session only change when refresh page or navigate
   const session = await getServerSession(nextAuthOptions);

   if (!session?.token) return redirect("/signin");

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
         {/* <CheckAuth /> */}
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
