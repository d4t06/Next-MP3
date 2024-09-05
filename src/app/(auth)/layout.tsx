import Button from "@/share/_components/Button";
import { HomeIcon } from "@heroicons/react/24/outline";
import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
   return (
      <div className="h-screen relative">
         {children}
         <Button
            href="/"
            className="!absolute p-[6px] bottom-[20px] left-[20px]"
            size={"clear"}
         >
            <HomeIcon className="w-6" />
         </Button>
      </div>
   );
}
