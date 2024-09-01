import Control from "@/components/Control";
import { ReactNode } from "react";

export default function DefaultLayout({ children }: { children: ReactNode }) {
   return (
      <div className="container">
         {children}
         <Control />
      </div>
   );
}
