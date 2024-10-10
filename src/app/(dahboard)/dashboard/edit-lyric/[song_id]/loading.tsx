import { Center } from "@/share/_components/Center";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

export default function Loading() {
   return (
      <Center>
         <ArrowPathIcon className="w-6 animate-spin text-amber-800" />
      </Center>
   );
}
