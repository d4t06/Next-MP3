import useGetLyic from "@/hooks/useGetLyric";
import SongLyric from "./SongLyric";
import { Center } from "@/share/_components/Center";
import { ArrowPathIcon } from "@heroicons/react/16/solid";

export default function SongLyricWrapper() {
   const { isFetching, lyrics } = useGetLyic();

   return (
      <>
         {isFetching ? (
            <Center>
               <ArrowPathIcon className=" w-6 animate-spin" />
            </Center>
         ) : (
            <>
               <SongLyric lyrics={lyrics} />
            </>
         )}
      </>
   );
}
