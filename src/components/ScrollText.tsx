import useScrollText from "@/hooks/useScrollText";
import { useRef } from "react";

type Props = {
   className?: string;
   content: string;
};

export default function ScrollText({ className = "h-[50px]", content }: Props) {
   const textWrapperRef = useRef<HTMLDivElement>(null);
   const textRef = useRef<HTMLDivElement>(null);

   useScrollText({ textRef, textWrapperRef, content });

   return (
      <div
         ref={textWrapperRef}
         className={`${className} relative overflow-hidden mask`}
      >
         <div
            ref={textRef}
            className={`absolute left-0 top-0 min-w-full whitespace-nowrap`}
         >
            {content}
         </div>
      </div>
   );
}
