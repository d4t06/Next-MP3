import ToastPortal from "@/components/ToastPortal";
import UploadImagePortal from "@/components/UploadPortal";
import Button from "@/share/_components/Button";
import SongSelectProvider from "@/stores/selectSongContext";
import ToastProvider from "@/stores/toastContext";
import { HomeIcon } from "@heroicons/react/24/outline";
import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
   return (
      <>
         <ToastProvider>
            <SongSelectProvider>
               <div className="fixed inset-0">
                  {children}

                  <Button
                     href="/"
                     className="!absolute p-2 bottom-5 left-8"
                     size={"clear"}
                  >
                     <HomeIcon className="w-6" />
                  </Button>
               </div>
            </SongSelectProvider>
            <UploadImagePortal />
            <ToastPortal autoClose />
         </ToastProvider>
      </>
   );
}
