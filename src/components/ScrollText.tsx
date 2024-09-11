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
      <div ref={textWrapperRef} className={`relative overflow-hidden  h-full`}>
         <div
            ref={textRef}
            className={`${className} absolute top-0 min-w-full whitespace-nowrap`}
         >
            {content}
         </div>
      </div>
   );
}
