"use client";

import Button from "@/share/_components/Button";
import { useState } from "react";

type Props = {
   song: Song;
   submit: (schema: Partial<SongSchema>) => void;
   loading: boolean;
   closeModal: () => void;
};

export default function EditSongModal({
   song,
   submit,
   loading,
   closeModal,
}: Props) {
   const [songData, setSongData] = useState<Partial<SongSchema>>({
      name: song.name,
      singer: song.singer,
   });

   const ableToSubmit =
      !!songData.name &&
      !!songData.singer &&
      (songData.name !== song.name || songData.singer !== song.singer);

   const handleSubmit = () => {
      if (!ableToSubmit) return;

      submit(songData);
   };

   return (
      <div
         className={` text-amber-800 w-[600px] max-w-[calc(90vw-40px)]
         ${loading ? "opacity-60 pointer-events-none" : ""}`}
      >
         <h1 className="text-xl font-medium ">Edit {song.name}</h1>

         <div className="mt-3 space-y-2">
            <div className="space-y-1">
               <label className={""} htmlFor="image">
                  Name
               </label>
               <input
                  type="text"
                  className="w-full bg-amber-800 text-amber-100 py-2 rounded-lg outline-none px-2"
                  autoComplete="off"
                  required
                  value={songData.name}
                  onChange={(e) =>
                     setSongData((prev) => ({ ...prev, name: e.target.value }))
                  }
               />
            </div>

            <div className="space-y-1">
               <label className={""} htmlFor="image">
                  Singer
               </label>
               <input
                  type="text"
                  className="w-full bg-amber-800 text-amber-100 py-2 rounded-lg outline-none px-2"
                  autoComplete="off"
                  required
                  value={songData.singer}
                  onChange={(e) =>
                     setSongData((prev) => ({
                        ...prev,
                        singer: e.target.value,
                     }))
                  }
               />
            </div>
         </div>

         <div className="flex space-x-3 mt-5">
            <Button onClick={closeModal}>Close</Button>
            <Button
               colors={"second"}
               className="min-w-[120px]"
               loading={loading}
               disabled={!ableToSubmit}
               onClick={handleSubmit}
            >
               Save
            </Button>
         </div>
      </div>
   );
}
