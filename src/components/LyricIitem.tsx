import { ElementRef, useEffect, useRef } from "react";

type Props = {
   status: "" | "active" | "done" | "coming";
   text: string;
   className?: string;
};

export default function LyricItem({
   status = "coming",
   text,
   className = 'pb-6',
}: Props) {
   const lyricRef = useRef<ElementRef<"p">>(null);

   const scroll = () => {
      const ele = lyricRef.current as HTMLElement;
      if (ele) {
         ele.scrollIntoView({
            behavior: "smooth",
            block: "center",
         });
      }
   };

   const getClass = () => {
      switch (status) {
         case "coming":
            return "";
         case "active":
            return "text-[#ffed00]";
         case "done":
            return "disabled";
      }
   };

   useEffect(() => {
      if (status === "active") {
         scroll();
      }
   }, [status]);

   return (
      <p className={`select-none font-[500] ${className} ${getClass()}`}>
         {text}
      </p>
   );
}
