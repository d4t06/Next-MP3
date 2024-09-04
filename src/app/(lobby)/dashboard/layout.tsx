import UploadImagePortal from "@/components/UploadPortal";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
   return (
      <>
         {children}
         <UploadImagePortal />
      </>
   );
}
