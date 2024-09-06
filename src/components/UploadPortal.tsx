"use client";

import useUploadSong from "@/hooks/useUploadSong";
import { useRef } from "react";
import Modal from "./Modal";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

function UploadImagePortal() {
   const inputRef = useRef<HTMLInputElement>(null);

   const { handleInputChange, isUploading, currentIndex, songSchemas } =
      useUploadSong();

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

         {isUploading && (
            <Modal closeModal={() => {}}>
               <div className="w-[400px] max-w-[85vw] text-amber-800 p-3">
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
               </div>
            </Modal>
         )}
      </>
   );
}

export default UploadImagePortal;
