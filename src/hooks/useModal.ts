import { Ref, useEffect, useImperativeHandle, useState } from "react";

export type ModalRef = {
   toggle: () => void;
   open: () => void;
   close: () => void;
};
export default function useModal({ ref }: { ref: Ref<ModalRef> }) {
   const [isOpen, setIsOpen] = useState(false);
   const [isMounted, setIsMounted] = useState(false);

   const toggle = () => {
      if (isMounted) setIsMounted(false);
      if (!isOpen) setIsOpen(true);
   };

   const open = () => {
      setIsOpen(true);
   };

   const close = () => {
      setIsMounted(false);
   };

   useImperativeHandle(ref, () => ({
      toggle,
      open,
      close,
   }));

   useEffect(() => {
      if (!isMounted) {
         setTimeout(() => {
            setIsOpen(false);
         }, 200);
      }
   }, [isMounted]);

   useEffect(() => {
      if (isOpen) {
         setIsMounted(true);
      }
   }, [isOpen]);

   return {
      isOpen,
      isMounted,
      toggle,
   };
}
