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
   if (!songs) return <NoResult />;

   return (
      <>
         <Control songs={songs} />

         {session && (
            <Button
               href="/dashboard"
               className="!absolute p-2 bottom-5 left-5"
               size={"clear"}
            >
               <ComputerDesktopIcon className="w-6" />
            </Button>
         )}
      </>
   );
}
