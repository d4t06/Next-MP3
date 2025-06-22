import { ReactNode } from "react";

type Props = {
   className?: string;
   children: ReactNode;
};

export default function MenuContentWrapper({
   children,
   className = "w-[200px]",
}: Props) {
   return (
   <div className={`rounded-md py-2 bg-amber-800 border-2 shadow-lg border-amber-900 text-[#fdf6e3] ${className}`}>
         {children}
      </div>
   );
}
