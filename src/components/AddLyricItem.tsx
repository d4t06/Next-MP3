import { useRef, useState, FormEvent, useEffect } from "react";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { useEditLyricContext } from "@/stores/editLyricContext";

type Props = {
   lyric: Lyric;
   seek: (time: number) => void;
   index: number;
};

export default function AddLyricItem({ lyric, index, seek }: Props) {
   const [isEditText, setIdEditText] = useState(false);
   const [text, setText] = useState(lyric.text);

   const textRef = useRef<HTMLInputElement>(null);

   const { updateLyric } = useEditLyricContext();

   const handleEdit = (e: FormEvent) => {
      e.preventDefault();

      updateLyric(index, text);
      setIdEditText(false);
   };

   const classes = {
      input: `rounded-md outline-none w-full px-2`,
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
            <p className="text-[16px] leading-[1.2] font-bold select-none flex items-center">
               {lyric.text}

               <button onClick={() => setIdEditText(true)} className="ml-[8px]">
                  <PencilSquareIcon className="w-[16px]" />
               </button>
            </p>
         )}

         {isEditText && (
            <form action="" onSubmit={handleEdit}>
               <input
                  onBlur={() => setIdEditText(false)}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  ref={textRef}
                  type="text"
                  className={classes.input}
               />
            </form>
         )}
      </div>
   );
}
