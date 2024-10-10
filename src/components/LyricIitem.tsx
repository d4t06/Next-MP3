import {
   ElementRef,
   MutableRefObject,
   RefObject,
   useEffect,
   useRef,
} from "react";

type Props = {
   status: "" | "active" | "done" | "coming";
   text: string;
   className?: string;
   scrollBehavior?: MutableRefObject<ScrollBehavior>;
};

export default function LyricItem({
   status = "coming",
   text,
   className = "pb-6",
   scrollBehavior,
}: Props) {
   const lyricRef = useRef<ElementRef<"p">>(null);

   const scroll = () => {
      lyricRef.current?.scrollIntoView({
         behavior: scrollBehavior?.current || "smooth",
         block: "center",
      });

      if (scrollBehavior?.current && scrollBehavior.current !== "smooth")
         scrollBehavior.current = "smooth";
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
      <p
         ref={lyricRef}
         className={`select-none font-[500] ${className} ${getClass()}`}
      >
         {text}
      </p>
   );
}
