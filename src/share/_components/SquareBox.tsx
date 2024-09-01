import { ReactNode } from "react";

type Props = {
   children: ReactNode;
   className?: string;
};

export default function SquareBox({ children }: Props) {
   return (
      <div className="relative w-full pt-[100%]">
         <div className="absolute inset-0 rounded-lg overflow-hidden">
            {children}
         </div>
      </div>
   );
}
