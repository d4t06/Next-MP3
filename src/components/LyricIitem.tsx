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
   shouldScroll?: boolean;
};

export default function LyricItem({
   status = "coming",
   text,
   className = "pb-6",
   scrollBehavior,
   shouldScroll = true,
}: Props) {
   const lyricRef = useRef<ElementRef<"p">>(null);

   const scroll = () => {
      console.log("scroll behavior", scrollBehavior?.current);

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
            return "text-[#ffed00] active-lyric";
         case "done":
            return "disabled";
      }
   };

   useEffect(() => {
      if (status === "active") {
         if (shouldScroll) scroll();
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
