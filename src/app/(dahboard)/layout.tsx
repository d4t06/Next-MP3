import ToastPortal from "@/components/ToastPortal";
import UploadImagePortal from "@/components/UploadPortal";
import SongSelectProvider from "@/stores/selectSongContext";
import ToastProvider from "@/stores/toastContext";
import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
   return (
      <>
         <ToastProvider>
            <SongSelectProvider>
               <div className="fixed inset-0">
                  <div className="container h-full md:max-w-[800px] ">
                     {children}
                  </div>
               </div>
            </SongSelectProvider>
            <UploadImagePortal />
            <ToastPortal autoClose />
         </ToastProvider>
      </>
   );
}
