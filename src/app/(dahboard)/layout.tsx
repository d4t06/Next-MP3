import ToastContainer from "@/components/toast-container/ToastContainer";
import UploadImagePortal from "@/components/upload-song-portal/UploadPortal";
import ToastProvider from "@/stores/toastContext";
import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
   return (
      <>
         <ToastProvider>
            <div className="fixed inset-0">{children}</div>
            <UploadImagePortal />
            <ToastContainer />
         </ToastProvider>
      </>
   );
}
