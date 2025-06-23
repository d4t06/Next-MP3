import { ReactNode } from "react";

type Props = {
   className?: string;
   children: ReactNode;
   noStyle?: boolean;
};

export default function MenuContentWrapper({
   children,
   className = "w-[200px]",
   noStyle
}: Props) {
   return (
      <div
         className={`${!noStyle ? 'border-amber-900 py-2 bg-amber-800 text-[#fdf6e3]' : ""} rounded-md  border-2 shadow-lg  ${className}`}
      >
         {children}
      </div>
   );
}
