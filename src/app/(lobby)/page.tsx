import Control from "@/components/Control";
import Button from "@/share/_components/Button";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "../api/auth/[...nextauth]/authOption";
import { ComputerDesktopIcon } from "@heroicons/react/24/outline";
import { getAllSong } from "@/share/services/songService";
import NoResult from "@/components/NoResult";
import Tooltip from "@/components/Tootip";

export const revalidate = 864000;

export default async function HomePage() {
   const session = await getServerSession(nextAuthOptions);

   const { songs } = (await getAllSong()) || {};
   if (!songs) return <NoResult />;

   return (
      <>
         <Control songs={songs} />

         <div className="!absolute bottom-8 left-8">
            {session && (
               <Tooltip content="Dashboard">
                  <Button href="/dashboard" className="p-2" size={"clear"}>
                     <ComputerDesktopIcon className="w-6" />
                  </Button>
               </Tooltip>
            )}
         </div>
      </>
   );
}
