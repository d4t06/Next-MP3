"use client";

import useModal from "./useModal";
import { forwardRef, MouseEventHandler, ReactNode, Ref } from "react";
import { createPortal } from "react-dom";

type Props = {
   children?: ReactNode;
   className?: string;
   childClassName?: string;
   persisted?: boolean;
};

export type ModalRef = {
   toggle: () => void;
   open: () => void;
   close: () => void;
};

function Modal(
   { children, className = "z-[99]", childClassName, persisted }: Props,
   ref: Ref<ModalRef>,
) {
   const { isMounted, isOpen, toggle } = useModal({ ref });

   const handleOverlayClick: MouseEventHandler = (e) => {
      if (persisted) return;
      e.stopPropagation();
      toggle();
   };

   const classes = {
      unMountedContent: "opacity-0 scale-[.95]",
      mountedContent: "opacity-100 scale-[1]",
      unMountedLayer: "opacity-0",
      mountedLayer: "opacity-100",
   };

   return (
      <>
         {isOpen &&
            createPortal(
               <>
                  <div
                     className={`fixed transition-opacity ease-linear duration-200 inset-0 bg-black/60 z-[99] 
                              ${
                                 isMounted
                                    ? classes.mountedLayer
                                    : classes.unMountedLayer
                              }
                           `}
                     onClick={handleOverlayClick}
                  ></div>
                  {children && (
                     <div
                        className={`fixed transition-[opacity,transform] ease-linear duration-200 ${className} top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]
      
                                       ${
                                          isMounted
                                             ? classes.mountedContent
                                             : classes.unMountedContent
                                       }
                                 `}
                     >
                        {/* <div
                           className={`${
                              childClassName || " py-[12px] px-[16px]"
                           } rounded-[8px] bg-[#fdf6e3]`}
                        > */}
                           {children}
                        {/* </div> */}
                     </div>
                  )}
               </>,
               document.querySelector("#portals")!,
            )}
      </>
   );
}

function ModalContentWrapper({
   children,
   noStyle,
   disable,
   className = "w-[400px]",
 }: {
   disable?: boolean;
   children: ReactNode;
   className?: string;
   noStyle?: boolean;
 }) {
 
   return (
     <div
       className={`max-h-[80vh] max-w-[90vw] flex flex-col  ${disable ? "disabled" : ""} ${!noStyle ? "p-3 rounded-xl" : ""} bg-[#fdf6e3] ${className}`}
     >
       {children}
     </div>
   );
 }

export default forwardRef(Modal);
export {ModalContentWrapper}


