"use client";

import useModal, { ModalRef } from "@/hooks/useModal";
import { forwardRef, ReactNode, Ref } from "react";
import { createPortal } from "react-dom";

type Props = {
   children?: ReactNode;
   className?: string;
   childClassName?: string;
};

function Modal(
   { children, className = "z-[99]", childClassName }: Props,
   ref: Ref<ModalRef>
) {
   const { isMounted, isOpen, toggle } = useModal({ ref });

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
                     onClick={(e) => {
                        e.stopPropagation();
                        toggle();
                     }}
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
                        <div
                           className={`${
                              childClassName || " py-[12px] px-[16px]"
                           } rounded-[8px] bg-amber-100`}
                        >
                           {children}
                        </div>
                     </div>
                  )}
               </>,
               document.querySelector("#portals")!
            )}
      </>
   );
}

export default forwardRef(Modal);
