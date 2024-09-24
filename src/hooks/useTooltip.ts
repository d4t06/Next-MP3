import { ElementRef, useEffect, useRef, useState } from "react";

export default function useTooltip() {
   const [isOpen, setIsOpen] = useState(false);

   const triggerRef = useRef<ElementRef<"div">>(null);

   const handleMouseEnter: EventListener = () => {
      setIsOpen(true);
   };

   const handleMouseLeave: EventListener = () => {
      setIsOpen(false);
   };

   useEffect(() => {
      if (!triggerRef.current) return;

      triggerRef.current.addEventListener("mouseenter", handleMouseEnter);
      triggerRef.current.addEventListener("mouseleave", handleMouseLeave);

      return () => {
         if (!triggerRef.current) return;
         triggerRef.current.removeEventListener("mouseenter", handleMouseEnter);
         triggerRef.current.removeEventListener("mouseleave", handleMouseLeave);
      };
   }, []);

   return {
      isOpen,
      triggerRef,
   };
}
