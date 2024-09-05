import Control from "@/components/Control";
import Button from "@/share/_components/Button";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "../api/auth/[...nextauth]/authOption";
import { ComputerDesktopIcon } from "@heroicons/react/24/outline";
import { getAllSong } from "@/share/services/getAllSong";
import NoResult from "@/components/NoResult";

export const revalidate = 86400;

export default async function HomePage() {
   const session = await getServerSession(nextAuthOptions);

   const { songs } = (await getAllSong()) || {};
   if (!songs || !songs.length) return <NoResult />;

   return (
      <>
         <Control songs={songs} />

         {session && (
            <Button
               href="/dashboard"
               className="!absolute p-2 bottom-[20px] left-[20px]"
               size={"clear"}
            >
               <ComputerDesktopIcon className="w-6" />
            </Button>
         )}
      </>
   );
}
