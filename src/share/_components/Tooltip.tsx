"use client";

import useTooltip from "@/hooks/useTooltip";
import { ReactNode } from "react";

type Props = {
   children: ReactNode;
   content: string;
   className?: string;
};

export default function Tooltip({ children, content, className }: Props) {
   const { isOpen, triggerRef } = useTooltip();

   const arrowPositionMap = {
      bottom: "before:border-t-amber-800 before:translate-y-[calc(50%+6px)]",
   };

   const classes = {
      arrow: `before:content-[''] before:absolute before:-translate-x-1/2 before:left-1/2  before:bottom-0 before:border-8 before:border-transparent `,
      content:
         "absolute font-[500] text-sm px-2 py-[2px] bg-amber-800 text-amber-100 whitespace-nowrap bottom-[calc(100%+8px)] -translate-x-1/2 left-1/2 rounded-md",
   };

   return (
      <div className="relative" ref={triggerRef}>
         {children}

         {isOpen && (
            <div
               className={` ${classes.content} ${classes.arrow} ${arrowPositionMap["bottom"]}   ${className}`}
            >
               {content}
            </div>
         )}
      </div>
   );
}
