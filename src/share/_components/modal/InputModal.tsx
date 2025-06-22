"use client";

import { FormEvent, useEffect, useState, useRef, ReactNode } from "react";
import {Button} from "..";

type Props = {
   closeModal: () => void;
   submit: (value: string) => void;
   title?: string;
   initValue?: string;
   children?: ReactNode;
   loading?: boolean;
   variant?: "input" | "text-area";
};

export default function InputModal({
   submit,
   title,
   initValue,
   loading,
   variant = "input",
   closeModal,
   children,
}: Props) {
   const [value, setValue] = useState(initValue || "");
   const inputRef = useRef<HTMLInputElement>(null);

   useEffect(() => {
      inputRef.current?.focus();
   }, []);

   const handleSubmit = (e: FormEvent) => {
      e.preventDefault();
      submit(value);
   };

   const classes = {
      input: "w-full bg-amber-900 text-amber-100 py-2 rounded-lg outline-none px-2 mt-3",
   };

   return (
      <div className="w-[400px] max-w-[85vw] bg-amber-100">
         <h1 className="text-xl font-medium ">{title || "Title"}</h1>

         <form action="" onSubmit={handleSubmit}>
            {variant === "input" && (
               <input
                  className="w-full"
                  ref={inputRef}
                  placeholder="name..."
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
               />
            )}

            {variant === "text-area" && (
               <textarea
                  className={`${classes.input} min-h-[50vh]`}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
               />
            )}

            {children}

            <div className="flex space-x-2 mt-5">
               <Button colors={"second"} loading={loading} type="submit">
                  Save
               </Button>

               <Button onClick={closeModal} loading={loading}>
                  close
               </Button>
            </div>
         </form>
      </div>
   );
}
