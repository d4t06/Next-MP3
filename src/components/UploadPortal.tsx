"use client";

import useUploadSong from "@/hooks/useUploadSong";
import { useRef } from "react";

function UploadImagePortal() {
   const inputRef = useRef<HTMLInputElement>(null);

   const { handleInputChange } = useUploadSong();

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
               accept="audio/mpeg3"
               id="song-upload"
               className="hidden"
            />
         </div>
      </>
   );
}

export default UploadImagePortal;
