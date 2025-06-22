import { useRef, useState, FormEvent, useEffect } from "react";
import { useEditLyricContext } from "./EditLyricContext";
import { PencilSquareIcon } from "@heroicons/react/16/solid";
import { formatTime } from "@/share/utils/appHelper";
import { LyricStatus } from "@/components/song-lyric/LyricItem";

type Props = {
   lyric: Lyric;
   seek: (time: number) => void;
   index: number;
   setPRef: (ele: HTMLParagraphElement) => void;
   isPreview: boolean;
   status: LyricStatus;
};

export default function AddLyricItem({
   lyric,
   index,
   isPreview,
   status,
   setPRef,
   seek,
}: Props) {
   const [isEditText, setIdEditText] = useState(false);
   const [text, setText] = useState(lyric.text);

   const textRef = useRef<HTMLTextAreaElement>(null);

   const { updateLyric } = useEditLyricContext();

   const handleEdit = (e: FormEvent) => {
      e.preventDefault();

      updateLyric(index, text);
      setIdEditText(false);
   };

   const classes = {
      input: `rounded-md bg-amber-900 text-amber-100 outline-none w-full p-2`,
   };

   useEffect(() => {
      if (isEditText) {
         textRef.current?.focus();
      }
   }, [isEditText]);

   return (
      <div className="last:mb-10">
         <button className={`text-white`} onClick={() => seek(lyric.start)}>
            {formatTime(lyric.start)}
         </button>

         <br />

         {!isEditText && (
            <p
               ref={(el) => setPRef(el!)}
               className={`select-none inline-flex py-2 ${status === "active" ? "text-[#ffed00]" : ""}`}
            >
               {lyric.text}

               {!isPreview && (
                  <button onClick={() => setIdEditText(true)} className="ml-1">
                     <PencilSquareIcon className="w-5" />
                  </button>
               )}
            </p>
         )}

         {isEditText && (
            <form action="" onSubmit={handleEdit}>
               <textarea
                  onBlur={() => setIdEditText(false)}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  ref={textRef}
                  className={classes.input}
               />
            </form>
         )}
      </div>
   );
}
