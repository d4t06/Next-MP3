"use client";

export type LyricStatus = "active" | "done" | "coming";

type Props = {
   status: LyricStatus;
   text: string;
   className?: string;
   getPRef?: (ele: HTMLParagraphElement) => void;
};

export default function LyricItem({
   status = "coming",
   text,
   getPRef,
   className = "pb-6",
}: Props) {
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
      <p
         ref={(ele) => (getPRef ? getPRef(ele!) : undefined)}
         className={`select-none ${className} ${getClass()}`}
      >
         {text}
      </p>
   );
}
