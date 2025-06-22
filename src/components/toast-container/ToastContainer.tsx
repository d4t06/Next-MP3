"use client";

import { useToast } from "@/stores/toastContext";
import { useEffect, useState } from "react";
import ToastItem from "./ToastItem";

export default function ToastContainer() {
   const { setToasts, toasts } = useToast();
   const [removing, setRemoving] = useState("");

   const removeToast = (id: string) => {
      setToasts((t) => t.filter((toast) => toast.id != id));
   };

   useEffect(() => {
      if (removing) {
         // console.log("set toast");
         setToasts((t) => t.filter((toast) => toast.id != removing));
      }
   }, [removing, setToasts]);

   useEffect(() => {
      if (!toasts.length) return;

      const id = toasts[toasts.length - 1].id;
      setTimeout(() => {
         setRemoving(id);
      }, 3000);
   }, [toasts]);

   const classes = {
      wrapper: "fixed z-[9999] bottom-[30px] right-[60px]",
      container: "flex space-y-[10px] flex-col",
   };

   return (
      <>
         <div className={classes.wrapper}>
            <div className={classes.container}>
               {!!toasts.length &&
                  toasts.map((toast, index) => (
                     <ToastItem
                        onClick={removeToast}
                        key={index}
                        toast={toast}
                     />
                  ))}
            </div>
         </div>
      </>
   );
}
