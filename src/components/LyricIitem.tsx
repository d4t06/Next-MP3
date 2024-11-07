"use client";
import { forwardRef, Ref } from "react";

export type LyricStatus = "active" | "done" | "coming";

type Props = {
   status: LyricStatus;
   text: string;
   className?: string;
};

function LyricItem(
   { status = "coming", text, className = "pb-6" }: Props,
   ref: Ref<any>
) {
   const getClass = () => {
      switch (status) {
         case "coming":
            return "";
         case "active":
            return "text-[#ffed00] active-lyric";
         case "done":
            return "disabled";
      }
   };

   return (
      <p ref={ref} className={`select-none ${className} ${getClass()}`}>
         {text}
      </p>
   );
}

export default forwardRef(LyricItem);
