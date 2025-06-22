"use client";

import useUploadSong from "./useUploadSong";
import { useRef } from "react";
import { Modal, ModalContentWrapper, type ModalRef } from "@/share/_components";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

function UploadImagePortal() {
   const inputRef = useRef<HTMLInputElement>(null);
   const modalRef = useRef<ModalRef>(null);

   const toggle = () => modalRef.current?.toggle();

   const { handleInputChange, currentIndex, songSchemas } = useUploadSong({
      toggleModal: toggle,
   });

   const classes = {
      container: `upload portal fixed z-[199] bottom-[120px] right-[30px] max-[549px]:bottom-[unset] max-[540px]:top-[10px] max-[540px]:right-[10px]`,
   };

   return (
      <>
         <div className={classes.container}>
            <input
               ref={inputRef}
               onChange={handleInputChange}
               type="file"
               multiple
               accept="audio/*"
               id="song-upload"
               className="hidden"
            />
         </div>

         <Modal ref={modalRef} persisted>
            <ModalContentWrapper className="text-amber-800 w-[400px]">
               <p className="text-xl font-medium">Uploading</p>
               <div className="space-y-2 mt-3">
                  {songSchemas.map((s, index) => {
                     const active = index === currentIndex;
                     return (
                        <div className="flex justify-between" key={index}>
                           <p
                              className={`font-medium whitespace-nowrap overflow-hidden text-ellipsis ${
                                 index < currentIndex ? "opacity-60" : ""
                              } ${
                                 active
                                    ? "text-amber-900 font-semibold max-w-[80%]"
                                    : ""
                              } `}
                           >
                              {s.name}
                           </p>

                           {active && (
                              <ArrowPathIcon className="text-amber-900 w-6 animate-spin" />
                           )}
                        </div>
                     );
                  })}
               </div>
            </ModalContentWrapper>
         </Modal>
      </>
   );
}

export default UploadImagePortal;
