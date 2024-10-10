import { useRef, useState, FormEvent, useEffect } from "react";
import { useEditLyricContext } from "@/stores/editLyricContext";
import { PencilSquareIcon } from "@heroicons/react/16/solid";

type Props = {
   lyric: Lyric;
   seek: (time: number) => void;
   index: number;
};

export default function AddLyricItem({ lyric, index, seek }: Props) {
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
      <div className="pb-[10px]">
         <button className={` `} onClick={() => seek(lyric.start)}>
            {lyric.start}s
         </button>

         {!isEditText && (
            <p className="font-[500] select-none flex items-center">
               {lyric.text}

               <button onClick={() => setIdEditText(true)} className="ml-2">
                  <PencilSquareIcon className="w-5" />
               </button>
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
