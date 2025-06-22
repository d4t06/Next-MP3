"use client";

import {
   cloneElement,
   // createContext,
   // ElementRef,
   forwardRef,
   HTMLProps,
   isValidElement,
   ReactNode,
   Ref,
   useEffect,
   useImperativeHandle,
   // useRef,
} from "react";
import { createPortal } from "react-dom";
import { usePopoverContext } from "./PopupContext";
import usePopupContent from "./usePopupContent";

type TriggerProps = {
   children: ReactNode;
   className?: string;
   needButton?: boolean;
};
export type TriggerRef = {
   close: () => void;
};

export const PopupTrigger = forwardRef(function (
   { children, needButton }: TriggerProps,
   ref: Ref<TriggerRef>,
) {
   const {
      refs,
      setIsMounted,
      setIsOpen,
      close,
      toggle,
      state: { isMounted, isOpen },
   } = usePopoverContext();

   useImperativeHandle(ref, () => ({ close }));

   useEffect(() => {
      if (!isMounted) {
         setTimeout(() => {
            setIsOpen(false);
         }, 400);
      }
   }, [isMounted]);

   useEffect(() => {
      if (isOpen) {
         setTimeout(() => {
            setIsMounted(true);
         }, 100);
      }

      return () => {
         if (!isOpen) {
            setIsMounted(false);
         }
      };
   }, [isOpen]);

   useEffect(() => {
      if (!isOpen) return;

      const handleClickOutside = (e: MouseEvent | TouchEvent) => {
         if (
            !refs.contentRef ||
            !refs.triggerRef ||
            refs.triggerRef.current?.contains(e.target as Node) ||
            refs.contentRef.current?.contains(e.target as Node)
         ) {
            return;
         }

         setIsMounted(false);
      };

      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);

      return () => {
         document.removeEventListener("mousedown", handleClickOutside);
         document.removeEventListener("touchstart", handleClickOutside);
      };
   }, [isOpen]);

   if (!needButton)
      if (isValidElement(children)) {
         return cloneElement(children, {
            onClick: toggle,
            ref: refs.triggerRef,
         } as HTMLProps<Element>);
      }

   return (
      <button ref={refs.triggerRef} onClick={toggle}>
         {children}
      </button>
   );
});

type ContentProps = {
   children: ReactNode;
   className?: string;
   animationClassName?: string;

   // append to portal prop
   position?: "left-bottom" | "right-bottom";
   origin?: "bottom right" | "bottom left" | "top right" | "top left";
   spacer?: number;
};

export function PopupContent(props: ContentProps) {
   const { animationRef } = usePopupContent(props);

   const {
      state: { isMounted, isOpen },
      appendOnPortal,
      setContentRef,
   } = usePopoverContext();

   // const animationRef = useRef<ElementRef<"div">>(null);

   // const setContentPos = () => {
   //    const triggerEle = refs.triggerRef.current;
   //    const contentEle = refs.contentRef.current;
   //    const animationEle = animationRef.current;

   //    if (!triggerEle || !contentEle) return;

   //    const triggerRect = triggerEle.getBoundingClientRect();

   //    // default is left bottom
   //    const contentPos = {
   //       top: triggerRect.top + triggerEle.clientHeight,
   //       left: triggerRect.left - contentEle.clientWidth - spacer,
   //    };

   //    if (appendOnPortal) {
   //       const { origin = "top right", position } = props;

   //       contentPos.top = triggerRect.top + triggerEle.clientHeight + spacer;

   //       switch (position) {
   //          // case "left-bottom": {}
   //          case "right-bottom":
   //             contentPos.left = triggerRect.left + spacer;
   //             break;
   //       }

   //       const isOverScreenHeight =
   //          contentPos.top + contentEle.clientHeight > window.innerHeight - 90;
   //       if (isOverScreenHeight) {
   //          let newTop =
   //             contentPos.top -
   //             contentEle.clientHeight -
   //             triggerEle.clientHeight;

   //          if (newTop - 60 < 0) newTop = 60;

   //          contentPos.top = newTop;
   //       }

   //       if (animationEle) {
   //          let finalOrigin = origin;

   //          if (isOverScreenHeight) finalOrigin = "bottom right";

   //          animationEle.style.transformOrigin = finalOrigin;
   //       }
   //    }

   //    contentEle.style.left = `${contentPos.left}px`;
   //    contentEle.style.top = `${contentPos.top}px`;
   // };

   // const handleWheel: EventListener = close;

   const classes = {
      unMountedContent: "opacity-0 scale-[.95]",
      mountedContent: "opacity-100 scale-[1]",
   };

   const content = (
      <div
         ref={setContentRef}
         className={`${appendOnPortal ? "fixed z-[99]" : "absolute"} ${
            props.className || ""
         }`}
      >
         <div
            ref={animationRef}
            className={` transition-[transform,opacity] duration-[.25s] ease-linear ${
               props.animationClassName || ""
            } ${isMounted ? classes.mountedContent : classes.unMountedContent}`}
         >
            {props.children}
         </div>
      </div>
   );

   // useEffect(() => {
   //    if (!appendOnPortal) return;

   //    if (isOpen) setContentPos();
   //    else return;

   //    const mainContainer = document.querySelector(".main-container");
   //    if (!mainContainer) return;

   //    mainContainer.addEventListener("wheel", handleWheel);

   //    return () => {
   //       if (mainContainer)
   //          mainContainer.removeEventListener("wheel", handleWheel);
   //    };
   // }, [isOpen]);

   if (!isOpen) return <></>;

   return (
      <>
         {appendOnPortal
            ? createPortal(content, document.getElementById("portals")!)
            : content}
      </>
   );
}
