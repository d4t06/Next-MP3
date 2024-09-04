import Button from "@/share/_components/Button";
import { ArrowUpIcon } from "@heroicons/react/24/outline";

export default function DashboardPage() {
   return (
      <>
         <div className="container">
            <div className="flex mt-5 justify-between items-center">
               <div className="text-xl">Songs</div>

               <Button className="" size={"clear"}>
                  <label
                     className="flex space-x-1 px-3 py-1"
                     htmlFor="song-upload"
                  >
                     <ArrowUpIcon className="w-6" />
                  </label>
               </Button>
            </div>
         </div>
      </>
   );
}
