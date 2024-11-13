import ToastPortal from "@/components/ToastPortal";
import UploadImagePortal from "@/components/UploadPortal";
import ToastProvider from "@/stores/toastContext";
import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
   return (
      <>
         <ToastProvider>
            <div className="fixed inset-0">{children}</div>
            <UploadImagePortal />
            <ToastPortal autoClose />
         </ToastProvider>
      </>
   );
}
